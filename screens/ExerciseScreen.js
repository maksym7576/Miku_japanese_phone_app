import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProgressBar, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import QuestionComponent from '../components/QuestionComponent';

class ExerciseScreen extends Component {
    constructor(props) {
        super(props);
        const { exerciseData } = props.route.params;
        this.state = {
            contentList: exerciseData || [],
            displayedContent: [],
            displayType: 'original',
            exersiceId: null,
            lessonResults: null,
            showLessonResults: false,
            currentIndex: 0,
            fontsLoaded: false,
            sound: null,
            isPlating: false,
            progress: 0,
            hasPlayedAudio: false,
        };
    }


    async componentDidMount() {
        await this.loadFonts();
    }

    async loadFonts() {
        await Font.loadAsync({
            'Parkinsans-Regular': require('../assets/fonts/Parkinsans-Medium.ttf'),
            // 'Parkinsans-Bold': require('../assets\fonts\Parkinsans-SemiBold.ttff'),
        });
        this.setState({ fontsLoaded: true });
    }

    displayTypes = ['original', 'katakana-hiragana', 'hiragana-ronamji'];

    // toggleDisplayType = () => {
    //     this.setState((prevState) => {
    //         const currentIndex = this.displayTypes.indexOf(prevState.displayType);
    //         const newType = this.displayTypes[(currentIndex + 1) % this.displayTypes.length];
    //         return { displayType: newType };
    //     });
    // };
    
    handleNextContent = () => {
        this.setState((prevState) => {
            const nextindex = prevState.currentIndex + 1;
            this.setState({ progress: 0 });
            if(nextindex < prevState.contentList.length) {
                return { currentIndex: nextindex, hasPlayedAudio: false};
            }
            return { currentIndex: prevState.currentIndex };
        });
    };

    componentWillUnmount() {
        if (this.state.sound) {
            this.state.sound.unloadAsync();
        }
    }

    playAudio = async (audioData) => {
        try {
            if (this.state.sound) {
                await this.state.sound.unloadAsync();
            }

            this.setState({ progress: 0 });

            const sound = new Audio.Sound();
            const audioUri = `data:audio/mp3;base64,${audioData}`;
            await sound.loadAsync({ uri: audioUri });
            this.setState({ sound, isPlating: true });

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    if (status.isPlaying) {
                        const progress = (status.positionMillis / status.durationMillis) * 100;
                        this.setState({ progress });
                    } else if (status.didJustFinish) {
                        this.setState({ progress: 100, isPlating: false });
                    }
                }
            });

            await sound.playAsync();
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    stopAudio = async () => {
        if(this.state.sound) {
            await this.state.sound.stopAsync(); 
            this.setState({ isPlating: false, progress: 0 });
        }
    };
    

    renderContent = () => {
        const { contentList, currentIndex, progress, isPlating, hasPlayedAudio} = this.state;
        const currentContent = contentList[currentIndex];

        if (
            currentContent &&
            currentContent.type === 'flash_card_popup' &&
            !hasPlayedAudio
        ) {
            setTimeout(() => {
            this.playAudio(currentContent.content.audio.audioData);
            this.setState({ hasPlayedAudio: true }); // Встановити прапорець
            }, 500);
        }
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
            case 'explanation_with_table':
                return (
                    <View>
                        <Text style={styles.title}>{currentContent.content.guidance.topic}</Text>
                        <View style={styles.containerPhrase}>
                        <Text style={styles.description}>{currentContent.content.guidance.description}</Text>
                        </View>
                        {currentContent.content.tableDTOList.map((tableItem, index) => (
                            <View key={index} style={styles.tableItemContainer}>
                                 <Text style={styles.tableItemName}>{tableItem.dynamicRow.tableName}</Text>
                                 <View style={styles.table}>
                                    <View style={[styles.row, styles.headerRow]}>
                                    <Text style={[styles.cell, styles.headerCell]}>Katakana</Text>
                                    <Text style={[styles.cell, styles.headerCell]}>Hiragana</Text>
                                    <Text style={[styles.cell, styles.headerCell]}>Romanji</Text>
                                    <Text style={[styles.cell, styles.headerCell]}>Translation</Text>
                                    </View>
                                 {tableItem.vocabularyList.map((tableWord, wordIndex) => (
                                    <View key={wordIndex} style={styles.row}>
                                        <Text style={styles.cell}>{tableWord.kanji_word}</Text>
                                        <Text style={styles.cell}>{tableWord.hiragana_or_katakana}</Text>
                                        <Text style={styles.cell}>{tableWord.romanji_word}</Text>
                                        <Text style={styles.cell}>{tableWord.translation}</Text>
                                    </View>
                                 ))}
                                 </View>
                            </View>
                        ))}
                    </View>
                );  
                case 'flash_card_popup':
                    return (
                        <View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${currentContent.content.image.imageData}` }}
                                style={styles.image}
                            />
                            <View style={styles.audioContainer}>
                                <TouchableOpacity
                                    onPress={
                                        isPlating
                                            ? this.stopAudio
                                            : () => this.playAudio(currentContent.content.audio.audioData)
                                    }
                                >
                                <Ionicons
                                name={isPlating ? 'stop-circle-outline' : 'play-circle-outline'}
                                size={50}
                                color="#fff"
                                />
                                </TouchableOpacity>
                                <View style={styles.progressOverlay}>
                                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                                </View>
                            </View>
                        </View>
                        <Text style={styles.title_flash_card}>{currentContent.content.object.romanji_word}/{currentContent.content.object.hiragana_or_katakana}/{currentContent.content.object.kanji_word}</Text>
                        <Text style={styles.translation_flash_card}>{currentContent.content.object.translation}</Text>
                        </View>
                    );
                case 'question':
                        const questionType = 'question';
                        return (
                            <View style={styles.centeredContainer}>
                            <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${currentContent.content.image.imageData}` }}
                                style={styles.image}
                            />
                            </View>
                            <QuestionComponent 
                                question={currentContent.content.question} 
                                answerList={currentContent.content.answerList} 
                                displayType={this.state.displayType} 
                                type={questionType}
                            />
                            </View>
                        );
                case 'explanation_with_phrases':
                    return (
                        <View>
                            <Text style={styles.title}>{currentContent.content.guidance.topic}</Text>
                            <View style={styles.containerPhrase}>
                            <Text style={styles.description}>{currentContent.content.guidance.description}</Text>
                            </View>
                            {currentContent.content.phrasesTableDTOList.map((tableItem, index) => (
                                <View  key={index} style={styles.tableItemContainer}>
                                    <Text style={styles.tableItemName}>{tableItem.dynamicRow.tableName}</Text>
                                    {tableItem.textList.map((tableWord, wordIndex) => (
                               <ScrollView>
                               <View key={wordIndex} style={styles.containerPhrase}>
                               <View style={styles.phraseContainer}>
                                <Text style={styles.textKanji}>{tableWord.kanji}</Text>
                                <Text style={styles.textHiragana}>{tableWord.hiragana_or_katakana}{' -> '}{tableWord.translation}</Text>
                                <View style={styles.translationContainer}>
                                    <Text style={styles.textRomanji}>{tableWord.romanji}</Text>
                                </View>
                                </View>
                               </View>
                           </ScrollView>
                                     ))}
                                </View>
                            ))}
                        </View>
                    );        
                default:
                    return null;
        }
    };

    handleFinish = () => {
        // Logic to handle finishing the exercise
        console.log("Exercise Finished!");
        // You can navigate to another screen or show a modal, etc.
    };

    render() {
        const { contentList, currentIndex } = this.state;
        const isLastContent = currentIndex === contentList.length - 1;
    
        return (
            <View style={styles.container}>
                <View style={styles.content}>{this.renderContent()}</View>
                {this.state.displayedContent.map((item, index) => this.renderContent(item, index))}
    
                {contentList.length > 0 ? (
                    isLastContent ? (
                        <TouchableOpacity onPress={this.handleFinish} style={styles.button}>
                            Finish
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={this.handleNextContent} style={styles.button}>
                            Next
                        </TouchableOpacity>
                    )
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
            backgroundColor: '#f0f0f0',
        },
        content: {
            flexGrow: 1,
            marginBottom: 20,
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width:0, height: 2},
            shadowRadius: 4,
            elevation: 2,
            alightItems: 'center',
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
        position: 'absolute', // Абсолютне позиціонування
        bottom: 0, // Прикріплення до самого низу
        left: 0, // Від лівого краю
        right: 0, // До правого краю
        fontSize: 21, // Розмір шрифту
        fontFamily: 'Parkinsans-Regular',
        textAlign: 'center', // Центрування по горизонталі
        backgroundColor: '#007AFF', // Колір фону (опціонально)
        color: '#ffffff', // Колір тексту
        paddingVertical: 10, // Вертикальний внутрішній відступ
        paddingHorizontal: 10 // Горизонтальний внутрішній відступ
    },
    buttonAudio:{
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        alightItems: 'center',
        margin: 10,
    },
        buttonText: {
            color: '#fff',
            frontSize: 16,
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
        stopButtonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        imageContainer: {
            width: '100%',
            aspectRatio: 16 / 9, // Фіксує співвідношення 16:9
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            backgroundColor: '#ddd', // Запасний фон на випадок відсутності зображення
            marginBottom: 20, // Відступи між зображенням та іншими елементами
        },
        // Стиль для зображення
        image: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover', // Зображення займає весь простір, зберігаючи пропорції
        },
        // Контейнер для аудіо та кнопок
        audioContainer: {
            position: 'absolute',
            bottom: 10, // Розміщення елементів у нижній частині контейнера
            left: 0,
            right: 0,
            alignItems: 'center',
        },
        // Кнопка відтворення/зупинки
        stopButton: {
            position: 'absolute',
            left: 10, // Розташування кнопки зліва
            bottom: 10, // Відступ знизу
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 30, // Кругла форма кнопки
            backgroundColor: '#ff5252',
        },
        stopButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        // Прогрес-бар
        progressOverlay: {
            width: '100%',
            height: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'absolute',
            bottom: 0,
            left: 0,
        },
        progressBar: {
            height: '100%',
            backgroundColor: '#4caf50',
        },
        centeredContainer: {
            flex: 1,                     // Займає весь доступний простір
            justifyContent: 'flex-start', // Розташовує контент зверху
            alignItems: 'center',        // Центрує по горизонталі            
            paddingHorizontal: 10,       // Відступи по боках
            backgroundColor: 'transparent', // Прозорий фон контейнера
        },
          textHiragana: {
            fontSize: 14, // Prominent size
            color: '#000', // Dark, clear color
            fontWeight: '600', // Bold to draw attention
            opacity: 1, // Full opacity
          },
          textKanji: {
            fontSize: 12, // Smaller than hiragana
            color: '#666', // Less prominent color
            opacity: 0.7, // Slightly transparent
          },
          textRomanji: {
            fontSize: 12, // Same size as kanji
            color: '#666', // Less prominent color
            opacity: 0.7, // Slightly transparent
            fontStyle: 'italic',
          },
          translationContainer: {
            flexDirection: 'row', // Inline with hiragana/katakana
            alignItems: 'center',
          },
          phraseContainer: {
            marginBottom: 10, // Space between phrases
            padding: 5,
          },
          containerPhrase: {
            alignItems: 'center',
          },
    })

export default ExerciseScreen;