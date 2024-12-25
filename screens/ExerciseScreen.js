import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Font from 'expo-font';
import QuestionComponent from '../components/QuestionComponent';
import MediaComponent from '../components/MediaComponent';
import ColocateExerciseComponent from '../components/ColocateExerciceComponent';
import SentenceCorrectionComponent from '../components/ColocateWIthErrorsComponent';
import ChooseQuestion from '../components/ChooseQuestion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { finishExercise } from '../services/ExerciseService';
import LessonResultPanel from '../components/LessonResultPanel';
const kanjiIcon = require('../assets/kanji-icon.png');
const hiraganaIcon = require('../assets/hiragana-icon.png');
const romanjiIcon = require('../assets/romanji-icon.png');
class ExerciseScreen extends Component {
    constructor(props) {
        super(props);
        const { exerciseData } = props.route.params;
        this.state = {
            contentList: exerciseData || [],
            displayedContent: [],
            displayTypes: ["kanji", "hiragana", "romanji"],
            displayType: "kanji",
            exersiceId: null,
            lessonResults: null,
            showLessonResults: false,
            currentIndex: 0,
            fontsLoaded: false,
            sound: null,
            isPlating: false,
            progress: 0,
            hasPlayedAudio: false,
            isSwitchDisabled: false, 
            showLessonResults: false,  
            exerciseResults: [], 
        };
    }


    async componentDidMount() {
        await this.loadFonts();
        if (this.state.contentList.length > 0) {
            this.setState({ exersiceId: this.state.contentList[0].content.id });
        }
    }

    async loadFonts() {
        await Font.loadAsync({
            'Parkinsans-Regular': require('../assets/fonts/Parkinsans-Medium.ttf'),
        });
        this.setState({ fontsLoaded: true });
    }

    handleModalOpen = () => {
        this.setState({ isSwitchDisabled: true });  
    };

    handleModalClose = () => {
        this.setState({ isSwitchDisabled: false });  
    };
    
    switchType = () => {
        const { displayTypes, displayType } = this.state;
        const currentIndex = displayTypes.indexOf(displayType);
        const nextIndex = (currentIndex + 1) % displayTypes.length; 
        this.setState({ displayType: displayTypes[nextIndex] });
      };
    
      handleNextContent = () => {
        this.setState((prevState) => {
            const nextIndex = prevState.currentIndex + 1;
            const progress = ((nextIndex + 1) / prevState.contentList.length) * 100;
    
            if (nextIndex < prevState.contentList.length) {
                return { currentIndex: nextIndex, progress };
            }
            return { currentIndex: prevState.currentIndex, progress: 100 };
        });
    };
    

    componentWillUnmount() {
        if (this.state.sound) {
            this.state.sound.unloadAsync();
        }
    }
    
    renderContent = () => {
        const { contentList, currentIndex, hasPlayedAudio } = this.state;
        const currentContent = contentList[currentIndex];
        const { displayType } = this.state;
    
        switch (currentContent.type) {
            case 'details':
                return (
                    <View>
                        <Text style={styles.title}>{currentContent.content.name}</Text>
                        <View style={styles.containerPhrase}>
                            <Text style={styles.description}>{currentContent.content.startDialogue}</Text>
                        </View>
                    </View>
                );
            case 'explanation':
                return (
                    <View>
                        <Text style={styles.title}>{currentContent.content.guidance.topic}</Text>
                        <View style={styles.containerPhrase}>
                        <Text style={styles.description}>{currentContent.content.guidance.description}</Text>
                        </View>
                        {currentContent.content.tableDTOList.map((tableItem, index) => (
                            <View key={index} style={styles.tableItemContainer}>
                                 <Text style={styles.tableItemName}>{tableItem.dynamicRow.tableName}</Text>
                                 {tableItem.type === "VOCABULARY" ?  (
                                 <View style={styles.table}>
                                    <View style={[styles.row, styles.headerRow]}>
                                    <Text style={[styles.cell, styles.headerCell]}>Katakana</Text>
                                    <Text style={[styles.cell, styles.headerCell]}>Hiragana</Text>
                                    <Text style={[styles.cell, styles.headerCell]}>Romanji</Text>
                                    <Text style={[styles.cell, styles.headerCell]}>Translation</Text>
                                    </View>
                                 {tableItem.textList.map((tableWord, wordIndex) => (
                                    <View key={wordIndex} style={styles.row}>
                                        <Text style={styles.cell}>{tableWord.kanji_word}</Text>
                                        <Text style={styles.cell}>{tableWord.hiragana_or_katakana}</Text>
                                        <Text style={styles.cell}>{tableWord.romanji_word}</Text>
                                        <Text style={styles.cell}>{tableWord.translation}</Text>
                                    </View>
                                 ))}
                                 </View>
                                   ) : (
                                    <View>
                                    {tableItem.textList.map((tableWord, wordIndex) => (
                                        <View key={wordIndex} style={styles.containerPhrase}>
                                        <View style={styles.phraseContainer}>
                                            <Text style={styles.textKanji}>{tableWord.kanji_word}</Text>
                                            <Text style={styles.textHiragana}>
                                            {tableWord.hiragana_or_katakana}{' -> '}{tableWord.translation}
                                            </Text>
                                            <View style={styles.translationContainer}>
                                            <Text style={styles.textRomanji}>{tableWord.romanji_word}</Text>
                                            </View>
                                        </View>
                                        </View>
                                    ))}
                                    </View>
                                   )}
                            </View>
                        ))}
                    </View>
                );  
                case 'flash_card_popup':
                    return (
                        <View>
                            <MediaComponent
                                mediaType={currentContent.content.mediaPackage.mediaType}
                                fileRecordsList={currentContent.content.mediaPackage.fileRecordsList || []}
                            />
                            <Text style={styles.title_flash_card}>
                                {currentContent.content.object.textDTO.romanji_word}/
                                {currentContent.content.object.textDTO.hiragana_or_katakana}/
                                {currentContent.content.object.textDTO.kanji_word}
                            </Text>
                            <Text style={styles.translation_flash_card}>
                                {currentContent.content.object.textDTO.translation}
                            </Text>
                        </View>
                    );
                case 'question':
                        return (
                            <View>
                            <MediaComponent mediaType={currentContent.content.mediaPackage.mediaType} fileRecordsList={currentContent.content.mediaPackage.fileRecordsList || []}
                            />
                            <QuestionComponent 
                                question={currentContent.content.object.question}
                                answers={currentContent.content.object.answer}
                                displayMode={displayType}
                                disableSwitch={this.handleModalOpen}
                                enableSwitch={this.handleModalClose}
                                onAnswer={(result) => {
                                    this.setState((prevState) => ({
                                        exerciseResults: [...prevState.exerciseResults, result],
                                    }));
                                }}
                                />
                            </View>
                        );
                    case 'exercise_colocate':
                        return (
                            <View style={styles.centeredContainer}>
                                 <MediaComponent mediaType={currentContent.content.mediaPackage.mediaType} fileRecordsList={currentContent.content.mediaPackage.fileRecordsList || []}/>
                                <ColocateExerciseComponent
                                 content={currentContent.content}
                                 displayMode={displayType}
                                 disableSwitch={this.handleModalOpen}  
                                 enableSwitch={this.handleModalClose}
                                 onAnswer={(result) => {
                                    this.setState((prevState) => ({
                                        exerciseResults: [...prevState.exerciseResults, result],
                                    }));
                                }}
                                />
                            </View>
                        );
                    case 'colocate_with_finding_errors':
                        return (
                            <View>
                                <SentenceCorrectionComponent
                                content={currentContent.content}
                                displayMode={displayType}
                                disableSwitch={this.handleModalOpen}  
                                enableSwitch={this.handleModalClose}
                                onAnswer={(result) => {
                                    this.setState((prevState) => ({
                                        exerciseResults: [...prevState.exerciseResults, result],
                                    }));
                                }}
                                />
                            </View>
                        );
                    case 'fact':
                        return (
                            <View>
                                   <MediaComponent mediaType={currentContent.content.mediaPackage.mediaType} fileRecordsList={currentContent.content.mediaPackage.fileRecordsList || []}/>
                                   <Text style={styles.title}>{currentContent.content.object.topic}</Text>
                        <View style={styles.containerPhrase}>
                            <Text style={styles.description}>{currentContent.content.object.description}</Text>
                        </View>
                            </View>
                        );
                    case 'question_with_english_answers':
                        return (
                            <View>
                                <MediaComponent mediaType={currentContent.content.mediaPackage.mediaType} fileRecordsList={currentContent.content.mediaPackage.fileRecordsList || []}/>
                                <QuestionComponent 
                                question={currentContent.content.object.question}
                                answers={currentContent.content.object.questionAnswerList}
                                displayMode="none"
                                disableSwitch={this.handleModalOpen} 
                                enableSwitch={this.handleModalClose}
                                onAnswer={(result) => {
                                    this.setState((prevState) => ({
                                        exerciseResults: [...prevState.exerciseResults, result],
                                    }));
                                }}
                                />
                            </View>
                        );
                    case 'question_choose':
                        return (
                            <View>
                                <ChooseQuestion
                                content={currentContent.content}
                                displayMode={displayType}
                                disableSwitch={this.handleModalOpen} 
                                enableSwitch={this.handleModalClose}
                                onAnswer={(result) => {
                                    this.setState((prevState) => ({
                                        exerciseResults: [...prevState.exerciseResults, result],
                                    }));
                                }}
                                />
                            </View>
                        )                
                default:
                    return null;
        }
    };

    handleFinish = async () => {
        try {
            console.log("Exercise Finished!", this.state.exerciseResults);
    
            // Отримання userData з AsyncStorage
            const userDataJson = await AsyncStorage.getItem('userData');
            const userData = userDataJson ? JSON.parse(userDataJson) : {};
    
            // Формування запиту
            const requestBody = {
                userId: userData.id, // userId із AsyncStorage
                exerciseId: this.state.exersiceId, // exerciseId зі стану
                userResponsesList: this.state.exerciseResults.map(result => ({
                    questionId: result.id,
                    isCorrect: result.isCorrect,
                })),
            };
    
            // Надсилання запиту до бекенду
            console.log(requestBody);
            const response = await finishExercise(requestBody);
            this.setState({showLessonResults: true});
            this.setState({lessonResults: response})
            // Логування відповіді від сервера
            console.log("Response from server:", response);
    
            // Тепер ви можете використовувати дані:
            console.log("Percentage:", response.percentage);
            console.log("Experience:", response.exp);
            console.log("Rewards List:", response.rewards);
    
        } catch (error) {
            console.error("Error finishing the exercise:", error);
        }
    };
    

    render() {
        const { contentList, currentIndex } = this.state;
        const isLastContent = currentIndex === contentList.length - 1;
        const { displayType } = this.state;
    
        return (
            <View style={styles.container}>
               {this.state.showLessonResults && (
                    <LessonResultPanel
                        results={this.state.lessonResults}
                        onClose={() => this.setState({ showLessonResults: false })}
                    />
                )}
                <View style={styles.content}>
                    <View style={styles.switch}>
                        <TouchableOpacity onPress={this.switchType} style={styles.buttonSwitch}>
                            {displayType === "kanji" ? (
                                <Image source={kanjiIcon} style={styles.icon} />
                            ) : (displayType === "hiragana" ? (
                                <Image source={hiraganaIcon} style={styles.icon} />
                            ) : (
                                <Image source={romanjiIcon} style={styles.icon} />
                            ))}
                            <Text style={styles.textSwitch}>{displayType}</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.scrollViewContainer}>
                    <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${this.state.progress}%` }]} />
                        </View>
                    <View style={styles.exercise}>
                        {this.renderContent()}
                    </View>
                    </ScrollView>
                </View>
                {this.state.displayedContent.map((item, index) => this.renderContent(item, index))}
                            
                {contentList.length > 0 ? (
                <TouchableOpacity
                onPress={isLastContent ? this.handleFinish : this.handleNextContent}
                style={[styles.button, this.state.isSwitchDisabled && styles.disabledButton]} 
                disabled={this.state.isSwitchDisabled} 
            >
                <Text style={[styles.buttonText, this.state.isSwitchDisabled && styles.buttonTextDisabled]}>{isLastContent ? 'Finish' : 'Next'}</Text>
            </TouchableOpacity>
      
                ) : null}
            </View>
        );
    }
}

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
    },
    content: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
    },
    progressBarContainer: {
        marginTop: 17,
        marginBottom: -20,
        height: 8, // Adjusted height for better visibility
        backgroundColor: '#e0e0e0',
        borderRadius: 6, // Slightly rounded edges for a smoother look
        marginHorizontal: 80,
        alignItems: 'left',
        justifyContent: 'center', // To center the percentage text inside the progress bar
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 6, // Same as container for consistency
        width: '0%', // Starting width, will change dynamically
        transition: 'width 0.3s ease-out', // Smooth transition when width changes
        transform: [{ translateX: 0 }], // The bar will appear to move from left to right
    },
    exercise: {
        marginTop: 25,
    },
    disabledButton: {
        position: 'absolute', 
        bottom: 0,
        left: 0,
        right: 0, 
        fontSize: 21,
        fontFamily: 'Parkinsans-Regular',
        textAlign: 'center', 
        backgroundColor: '#525252',
        color: '#ffffff', 
        paddingVertical: 10,
        paddingHorizontal: 10 
    },
    scrollViewContainer: {
        flex: 1, 
    },
    switch: {
        position: 'absolute',
        top: 0,
        right: 0,
        marginTop: -10,
        zIndex: 10,   
    },
    buttonSwitch: {
        marginVertical: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center',  
        elevation: 3,  
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 8,
        tintColor: '#ffffff',
        alignSelf: 'center',  
    },
    textSwitch: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
        title: {
            fontSize: 21,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
            color: '#333',
        },
        title_flash_card: {
            fontSize: 21,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'left',
            color: '#333',
        },
        translation_flash_card: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'left',
            color: '#333',                   
            opacity: 0.6,
        },
        description: {
            fontSize: 16,
            color: '#555'
        },
        tableItemContainer: {
            marginVertical: 5,
            padding: 10,
            backgroundColor: '#f9f9f9',
            borderRadius: 5,
        },
        tableItemName: {
            fontSize: 16,
            textAlign: 'center',
            color: '#333',
            fontFamily: 'Parkinsans-Regular',
        },
        button: {
        position: 'absolute', 
        bottom: 0,
        left: 0, 
        right: 0, 
        fontSize: 21, 
        fontFamily: 'Parkinsans-Regular',
        textAlign: 'center',
        backgroundColor: '#007AFF', 
        color: '#ffffff', 
        paddingVertical: 10, 
        paddingHorizontal: 10,
        zIndex: 1,
    },
        row: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
        },
        cell: {
            flex: 1,
            padding: 10,
            textAlign: 'center',
            frontSize: 14,
            borderRightWidth: 1,
            borderRightColor: '#ccc',
        },
        table: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
        },
        headerRow: {
            backgroundColor: '#e6e6e6',
        },
        headerCell: {
            frontWeight: 'bold',
            color: '#333',
        },
        centeredContainer: {
            flex: 1,                    
            justifyContent: 'flex-start', 
            alignItems: 'center',              
            paddingHorizontal: 10,    
            backgroundColor: 'transparent', 
        },
          textHiragana: {
            fontSize: 14,
            color: '#000',
            fontWeight: '600',
            opacity: 1, 
          },
          textKanji: {
            fontSize: 12, 
            color: '#666',
            opacity: 0.7, 
          },
          textRomanji: {
            fontSize: 12, 
            color: '#666',
            opacity: 0.7,
            fontStyle: 'italic',
          },
          translationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
          },
          phraseContainer: {
            marginBottom: 10, 
            padding: 5,
          },
          containerPhrase: {
            alignItems: 'center',
          },
          buttonText: {
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0,
            fontSize: 21, 
            fontFamily: 'Parkinsans-Regular',
            textAlign: 'center', 
            backgroundColor: '#007AFF',
            color: '#ffffff', 
            paddingVertical: 10,
            paddingHorizontal: 10 
          },
          buttonTextDisabled: {
            position: 'absolute', 
            bottom: 0,
            left: 0, 
            right: 0, 
            fontSize: 21,
            fontFamily: 'Parkinsans-Regular',
            textAlign: 'center', 
            backgroundColor: '#525252',
            color: '#ffffff', 
            paddingVertical: 10, 
            paddingHorizontal: 10 
          },
    })

export default ExerciseScreen;