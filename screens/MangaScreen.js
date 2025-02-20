import React, { Component } from 'react';
import { Image, View, ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { finishManga } from '../services/MangaService';
import LessonResultPanel from '../components/LessonResultPanel';
import MediaComponent from '../components/MediaComponent';
import QuestionComponent from '../components/QuestionComponent';
import ColocateExerciseComponent from '../components/ColocateExerciceComponent';

const windowWidth = Dimensions.get('window').width;
const kanjiIcon = require('../assets/kanji-icon.png');
const hiraganaIcon = require('../assets/hiragana-icon.png');
const romanjiIcon = require('../assets/romanji-icon.png');

class MangaScreen extends Component {
    constructor(props) {
        super(props);
        const { mangaData } = props.route.params;
        this.state = {
            contentList: mangaData || [],
            displayedContent: [],
            displayTypes: ["kanji", "hiragana", "romanji"],
            displayType: "kanji",
            mangaId: null,
            lessonResults: null,
            showLessonResults: false,
            soundObjects: {},
            translations: {},
            exerciseResults: [],
            isSwitchDisabled: false,
        };
    }

    componentDidMount() {
        this.initializeAudio();
    }

    componentWillUnmount() {
        Object.values(this.state.soundObjects).forEach(async (sound) => {
            if (sound) await sound.unloadAsync();
        });
    }

    initializeAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });
        } catch (error) {
            console.error("Error initializing audio:", error);
        }
    };

    setMangaId = (id) => {
        if (!this.state.mangaId) {
            this.setState({ mangaId: id });
        }
    };

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

    handleFinish = async () => {
        try {
            const userResponsesJson = await AsyncStorage.getItem('quizResults');
            const userDataJson = await AsyncStorage.getItem('userData');
            const userResponses = userResponsesJson ? JSON.parse(userResponsesJson) : { answerHistory: [] };
            const userData = userDataJson ? JSON.parse(userDataJson) : {};
            const mangaId = this.state.mangaId;

            const answersDTO = [
                ...userResponses.answerHistory,
                ...this.state.exerciseResults
            ].map(answer => ({
                answerId: answer.answerId,
                type: answer.type,
                isCorrect: answer.isCorrect,
            }));

            const response = await finishManga(answersDTO, userData.id, mangaId);
            
            if (Array.isArray(response) && response.length > 0) {
                this.setState({ 
                    lessonResults: response, 
                    showLessonResults: true 
                });
            }
        } catch (error) {
            console.error("Error in handleFinish:", error);
        }
    };

    loadAndPlayAudio = async (audioUrl, id) => {
        try {
            console.log(`Loading and playing audio for id: ${id}`);
            let soundObject = this.state.soundObjects[id];
            
            if (!soundObject) {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioUrl },
                    { shouldPlay: true }
                );
                soundObject = sound;
                this.setState(prevState => ({
                    soundObjects: {
                        ...prevState.soundObjects,
                        [id]: sound
                    }
                }));
            } else {
                await soundObject.replayAsync();
            }
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    toggleTranslation = (id) => {
        console.log(`Toggling translation for id: ${id}`);
        this.setState(prevState => ({
            translations: {
                ...prevState.translations,
                [id]: !prevState.translations[id]
            }
        }));
    };

    handleNextContent = () => {
        console.log("Handling next content");
        if (this.state.contentList.length > 0) {
            const [nextContent, ...remainingContent] = this.state.contentList;
            this.setState(prevState => ({
                displayedContent: [...prevState.displayedContent, nextContent],
                contentList: remainingContent,
            }));

            if (nextContent?.content?.mediaPackage?.fileRecordsList) {
                const audioFile = nextContent.content.mediaPackage.fileRecordsList
                    .find(file => file.type === 'audio');
                if (audioFile) {
                    this.loadAndPlayAudio(audioFile.url, `audio-${this.state.displayedContent.length}`);
                }
            }
        }
    };

    renderSplitPanel = (leftItem, rightItem, keyIndex) => {
      return (
          <View key={`split-${keyIndex}`} style={styles.splitContainer}>
              {this.renderMangaPanel(leftItem, 'left', `${keyIndex}-left`)}
              {this.renderMangaPanel(rightItem, 'right', `${keyIndex}-right`)}
          </View>
      );
  };
  

    renderMangaPanel = (item, position = 'center', keyIndex) => {
        if (!item) return null;

        console.log(`Rendering manga panel for position: ${position}, keyIndex: ${keyIndex}`);
        const imageFile = item.content.mediaPackage.fileRecordsList.find(file => file.type === 'image');
        const audioFile = item.content.mediaPackage.fileRecordsList.find(file => file.type === 'audio');
        const text = item.content.object.textDTO;
        const showTranslation = this.state.translations[`${position}-${keyIndex}`];

        return (
            <View style={[
                styles.mangaPanel,
                position === 'center' ? styles.centerPanel : 
                position === 'left' ? styles.leftPanel : styles.rightPanel
            ]}>
                <TouchableOpacity 
                    style={styles.speechBubble}
                    onPress={() => this.toggleTranslation(`${position}-${keyIndex}`)}
                >
                    <Text style={styles.speechText}>
                        {this.state.displayType === 'kanji' ? text.kanji_word :
                         this.state.displayType === 'hiragana' ? text.hiragana_or_katakana :
                         text.romanji_word}
                    </Text>
                    {showTranslation && (
                        <Text style={styles.translationText}>{text.translation}</Text>
                    )}
                </TouchableOpacity>

                <View style={position === 'center' ? styles.centerImageContainer : styles.imageContainer}>
                    <Image 
                        source={{ uri: imageFile.url }} 
                        style={position === 'center' ? styles.centerMangaImage : styles.mangaImage}
                        resizeMode="contain"
                    />
                    {audioFile && (
                        <TouchableOpacity 
                            style={styles.audioButton}
                            onPress={() => this.loadAndPlayAudio(audioFile.url, `${position}-${keyIndex}`)}
                        >
                            <Ionicons name="volume-high" size={24} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    renderContent = (item, index) => {
        switch (item.type) {
            case 'guidance':
                return (
                    <View key={`guidance-${index}`} style={styles.guidancePanel}>
                        <MediaComponent 
                            mediaType={item.content.mediaPackage.mediaType} 
                            fileRecordsList={item.content.mediaPackage.fileRecordsList || []}
                        />
                        <Text style={styles.guidanceTopic}>{item.content.object.topic}</Text>
                        <Text style={styles.guidanceText}>{item.content.object.description}</Text>
                    </View>
                );
            case 'question':
                return (
                    <View key={`question-${index}`}>
                        <MediaComponent 
                            mediaType={item.content.mediaPackage.mediaType} 
                            fileRecordsList={item.content.mediaPackage.fileRecordsList || []}
                        />
                        <QuestionComponent
                            question={item.content.object.question}
                            answers={item.content.object.answer}
                            displayMode={this.state.displayType}
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
                    <View key={`exercise-${index}`} style={styles.centeredContainer}>
                        <MediaComponent 
                            mediaType={item.content.mediaPackage.mediaType} 
                            fileRecordsList={item.content.mediaPackage.fileRecordsList || []}
                        />
                        <ColocateExerciseComponent
                            content={item.content}
                            displayMode={this.state.displayType}
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
            case 'centre_phrase':
                return this.renderMangaPanel(item, 'center', index);
            case 'right_phrase':
                if (this.state.displayedContent[index + 1]?.type === 'left_phrase') {
                    return this.renderSplitPanel(
                        this.state.displayedContent[index + 1],
                        item,
                        index
                    );
                }
                return this.renderMangaPanel(item, 'right', index);
            case 'left_phrase':
                if (index > 0 && this.state.displayedContent[index - 1]?.type === 'right_phrase') {
                    return null;
                }
                return this.renderMangaPanel(item, 'left', index);
            default:
                return null;
        }
    };

    render() {
        const { displayType } = this.state;
        let displayIcon;
        switch (displayType) {
            case "kanji":
                displayIcon = kanjiIcon;
                break;
            case "hiragana":
                displayIcon = hiraganaIcon;
                break;
            case "romanji":
                displayIcon = romanjiIcon;
                break;
            default:
                displayIcon = kanjiIcon;
        }

        return (
            <View style={styles.container}>
                <View style={styles.switch}>
                    <TouchableOpacity onPress={this.switchType} style={styles.buttonSwitch}>
                        <Image source={displayIcon} style={styles.icon} />
                        <Text style={styles.textSwitch}>{displayType}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.contentContainer}>
                        {this.state.displayedContent.map((item, index) => 
                            this.renderContent(item, index)
                        )}
                    </View>

                    {this.state.contentList.length > 0 ? (
                        <TouchableOpacity 
                            onPress={this.handleNextContent} 
                            style={styles.navigationButton}
                        >
                            <Text style={styles.navigationButtonText}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            onPress={this.handleFinish} 
                            style={[styles.navigationButton, styles.finishButton]}
                        >
                            <Text style={styles.navigationButtonText}>Finish</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>

                {this.state.showLessonResults && (
                    <LessonResultPanel
                        results={this.state.lessonResults}
                        onClose={() => this.setState({ showLessonResults: false })}
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    buttonSwitch: {
        marginVertical: 40,
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
        width: 24,
        height: 24,
        marginRight: 8,
        tintColor: '#ffffff',
        alignSelf: 'center',  
    },
    textSwitch: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 8,
    },
    splitContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    mangaPanel: {
        alignItems: 'center',
        marginVertical: 8,
    },
    centerPanel: {
        height: 250,
        width: '100%',
        borderRadius: 8,
    },
    leftPanel: {
        flex: 1,
        marginRight: 4,
    },
    rightPanel: {
        flex: 1,
        marginLeft: 4,
    },
    imageContainer: {
        height: 200,
        width: '100%',
        borderRadius: 8,
    },
    mangaImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    speechBubble: {
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
        maxWidth: '90%',
        borderWidth: 1,
        borderColor: '#000000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    speechText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#000000',
    },
    translationText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginTop: 4,
        fontStyle: 'italic',
    },
    audioButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 20,
        padding: 8,
    },
    guidancePanel: {
        alignItems: 'center',
        marginVertical: 16,
        padding: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
    },
    guidanceTopic: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
    },
    guidanceText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 4,
    },
    navigationButton: {
        backgroundColor: '#4A90E2',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    navigationButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    finishButton: {
        backgroundColor: '#D0021B',
    },
    centeredContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
});

export default MangaScreen;