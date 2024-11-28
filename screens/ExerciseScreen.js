import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProgressBar, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import * as Font from 'expo-font';

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
            if(nextindex < prevState.contentList.length) {
                return { currentIndex: nextindex };
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

            const sound = new Audio.Sound();
            const audioUri = `data:audio/mp3;base64,${audioData}`;
            await sound.loadAsync({ uri: audioUri });
            this.setState({ sound, isPlating: true });

            sound.setOnPlaybackStatusUpdate((status) => {
                if(status.isLoaded && status.isPlaying ) {
                    const progress = (status.positionMillis / status.durationMillis) * 100;
                    this.setState({ progress });
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
        const { contentList, currentIndex, progress, isPlating } = this.state;
        const currentContent = contentList[currentIndex];
        switch (currentContent.type) {
            case 'details':
                return (
                    <View>
                        <Text style={styles.title}>{currentContent.content.name}</Text>
                        <Text style={styles.description}>{currentContent.content.startDialogue}</Text>
                    </View>
                );
            case 'explanation_with_table':
                return (
                    <View>
                        <Text style={styles.title}>{currentContent.content.guidance.topic}</Text>
                        <Text style={styles.description}>{currentContent.content.guidance.description}</Text>
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
                    <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${currentContent.content.image.imageData}` }}
                        style={styles.image}
                    />
                    <View style={styles.progressOverlay}>
                        <View style={[styles.progressBar, { width: `${progress}%` }]} />
                    </View>
                    <TouchableOpacity
                        style={[styles.stopButton, { backgroundColor: isPlating ? '#ff5252' : '#4caf50' }]}
                        onPress={isPlating ? this.stopAudio : () => this.playAudio(currentContent.content.audio.audioData)}
                    >
                        <Text style={styles.stopButtonText}>{isPlating ? 'Stop' : 'Play'}</Text>
                    </TouchableOpacity>
                </View>
                
                );
                default:
                    return null;
        }
    };

    render() {
        const { contentList, currentIndex } = this.state;
        const isLastContent = currentIndex === contentList.length - 1;
        return (
            <View style={styles.container}>
                <View style={styles.content}>{this.renderContent()}</View>
                {this.state.displayedContent.map((item, index) => this.renderContent(item, index))}

                {this.state.contentList.length > 0 ? (
                    <TouchableOpacity onPress={this.handleNextContent} style={styles.button}>Next</TouchableOpacity>
                ) : (
                    <TouchableOpacity>Finish</TouchableOpacity>
                )}
            </View>
        )
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
        description: {
            fontSize: 16,
            textAlign: 'center',
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
    progressOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 5,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4caf50',
    },
    progress: {
        height: '100%',
        backgroundColor: '#4caf50',
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
        image: {
            width: '100%',
            height: 'auto',
        },
        audioContainer: {
            flexDirection: 'row',
            alignItems: 'stretch',
            marginVertical: 20,
        },
        imageContainer: {
            flex: 1,
        position: 'relative',
        },
        stopButton: {
            position: 'absolute',
            left: 10,  // Кнопка зліва від зображення
            top: '50%',  // Центруємо по вертикалі
            transform: [{ translateY: -20 }], // Трошки зміщуємо для центрованості
            width: 40,
            height: 40,
            backgroundColor: '#ff5252',
            justifyContent: 'center',
            borderRadius: 10,
        },
        stopButtonText: {
            color: '#fff',
            frontSize: 18,
            frontWeight: 'bold',
        },
    })

export default ExerciseScreen;