import React, { Component } from 'react';
import { Image, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import mainStyles from '../styles/MainScreenStyles';
import DialogueComponent from '../components/DialogueComponent';
import QuestionComponent from '../components/QuestionComponent';
import ImageComponent from '../components/ImageComponent';
import ImagesTogethterComponent from '../components/ImagesTogesterComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { finishManga } from '../services/MangaService';
import LessonResultPanel from '../components/LessonResultPanel';

class MangaScreen extends Component {
    constructor(props) {
        super(props);
        const { mangaData } = props.route.params;
        this.state = {
            contentList: mangaData || [],
            displayedContent: [],
            displayType: 'original',
            mangaId: null,
            lessonResults: null, 
            showLessonResults: false,  
        };
    }

    setMangaId = (id) => {
        if (!this.state.mangaId) {
            this.setState({ mangaId: id });
        }
    }

    handleFinish = async () => {
        try {
            // Завантажуємо результати з AsyncStorage
            const userResponsesJson = await AsyncStorage.getItem('quizResults');
            const userDataJson = await AsyncStorage.getItem('userData');
    
            // Якщо дані є в AsyncStorage, парсимо їх, якщо ні, то задаємо дефолтні значення
            const userResponses = userResponsesJson ? JSON.parse(userResponsesJson) : {  answerHistory: [] };
            const userData = userDataJson ? JSON.parse(userDataJson) : {};
            const mangaId = this.state.mangaId; // Маємо ID манги
    
            // Формуємо об'єкт для відправки на сервер
            const answersDTO = userResponses.answerHistory.map(answer => ({
                answerId: answer.answerId,  // Відповідь
                type: answer.type,          // Тип питання
                isCorrect: answer.isCorrect, // Правильність відповіді
            }));
    
            // Відправляємо на сервер
            console.log("Submitting answers:", answersDTO);
            const response = await finishManga(answersDTO, userData.id, mangaId);
            console.log("Response data:", response);
    
            // Якщо відповідь валідна, оновлюємо стан з результатами уроку
            if (Array.isArray(response) && response.length > 0) {
                this.setState({ lessonResults: response, showLessonResults: true });
            } else {
                console.error("Invalid response structure:", response);
                this.setState({ showLessonResults: false });
            }
        } catch (error) {
            console.error("Error in handleFinish:", error);
        }
    };
    
    
    
    
    displayTypes = ['original', 'hiragana', 'romanji'];

    toggleDisplayType = () => {
        this.setState((prevState) => {
            const currentIndex = this.displayTypes.indexOf(prevState.displayType);
            const newType = this.displayTypes[(currentIndex + 1) % this.displayTypes.length];
            return { displayType: newType };
        });
    };

    handleNextContent = () => {
        if (this.state.contentList.length > 0) {
            const [nextContent, ...remainingContent] = this.state.contentList;
            this.setState((prevState) => ({
                displayedContent: [...prevState.displayedContent, nextContent],
                contentList: remainingContent,
            }));
        }
    };

    renderContent = (item, index) => {
        switch (item.type) {
            case 'dialogue':
                return (
                    <DialogueComponent
                        key={`dialogue-${index}`}
                        dialogue={item.content}
                        displayType={this.state.displayType}
                    />
                );
            case 'manga':
                this.setMangaId(item.content.id);
                return (
                    <View key={`manga-${index}`} style={mainStyles.mangaHeader}>
                        <Text style={mainStyles.mangaTitle}>{item.content.name}</Text>
                        <Text style={mainStyles.startDialogue}>{item.content.startDialogue}</Text>
                    </View>
                );
                case 'image':
                    return (
                      <ImageComponent
                        key={`image-${index}`}
                        imageSource={`data:image/jpeg;base64,${item.content.image.imageData}`}
                        photoDescription={item.content.mangaPhotoDescription}
                        displayType={this.state.displayType}
                        content={{
                          image: item.content.image, // передаємо дані зображення
                          audio: item.content.audio, // передаємо аудіо
                        }}
                      />
                    );
                  
            case 'images_together':
                return (
                    <ImagesTogethterComponent
                        key={`image_together-${index}`}
                        content={item.content}
                        displayType={this.state.displayType}
                    />
                );
            case 'question':
                const questionType = 'question';
                return (
                    <QuestionComponent 
                        key={`question-${index}`} 
                        question={item.content.question} 
                        answerList={item.content.answerList} 
                        displayType={this.state.displayType} 
                        type={questionType}
                    />
                );
            default:
                return null;
        }
    };

    render() {
        return (
            <View style={{ flex: 1, position: 'relative' }}>
                <ScrollView style={mainStyles.container}>
                    <TouchableOpacity onPress={this.toggleDisplayType} style={mainStyles.toggleButton}>
                        <Text style={mainStyles.toggleButtonText}>
                            {this.state.displayType.charAt(0).toUpperCase() + this.state.displayType.slice(1)}
                        </Text>
                    </TouchableOpacity>
    
                    {this.state.displayedContent.map((item, index) => this.renderContent(item, index))}
    
                    {this.state.contentList.length > 0 ? (
                        <TouchableOpacity onPress={this.handleNextContent} style={mainStyles.nextButton}>
                            <Text style={mainStyles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={this.handleFinish} style={mainStyles.nextButton}>
                            <Text style={mainStyles.nextButtonText}>Finish</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
    
                {/* LessonResultPanel відображається по центру екрану поверх інших об'єктів */}
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

export default MangaScreen;
