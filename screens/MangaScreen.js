import React, { Component } from 'react';
import { Image } from 'react-native'; // or 'expo-image' if using Expo
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import mainStyles  from '../styles/MainScreenStyles';
import DialogueComponent from '../components/DialogueComponent';
import QuestionComponent from '../components/QuestionComponent';
import ImageComponent from '../components/ImageComponent';
import styles   from '../styles/ImageStyles_together';

class MangaScreen extends Component {
    constructor(props) {
        super(props);
        const { mangaData } = props.route.params;
        this.state = {
            contentList: mangaData || [],
            displayedContent: [],
            displayType: 'original',
        };
    }

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
            if (
                nextContent.type === 'image' &&
                remainingContent[0]?.type === 'image' &&
                nextContent.content.position === 'left' &&
                remainingContent[0].content.position === 'right'
            ) {
                this.setState((prevState) => ({
                    displayedContent: [
                        ...prevState.displayedContent,
                        { left: nextContent, right: remainingContent[0] }
                    ],
                    contentList: remainingContent.slice(1),
                }));
            } else {
                this.setState((prevState) => ({
                    displayedContent: [...prevState.displayedContent, nextContent],
                    contentList: remainingContent,
                }));
            }
        }
    };

    renderContent = (item, index) => {
        if (item.left && item.right) {
            return (
                <View key={`pair-${index}`} style={mainStyles .imageRowContainer}>
                    <ImageComponent
                        imageSource={`data:image/jpeg;base64,${item.left.content.imageData}`}
                        dialogueText={item.left.content.mangaPhotoDescription.dialogue_hiragana_katakana}
                        position="left"
                    />
                    <ImageComponent
                        imageSource={`data:image/jpeg;base64,${item.right.content.imageData}`}
                        dialogueText={item.right.content.mangaPhotoDescription.dialogue_hiragana_katakana}
                        position="right"
                    />
                </View>
            );
        } else {
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
                    return (
                        <View key={`manga-${index}`} style={mainStyles .mangaHeader}>
                            <Text style={mainStyles .mangaTitle}>{item.content.name}</Text>
                            <Text style={mainStyles .startDialogue}>{item.content.startDialogue}</Text>
                        </View>
                    );
                case 'image':
                    return (
                        <ImageComponent
                            key={`image-${index}`}
                            imageSource={`data:image/jpeg;base64,${item.content.imageData}`}
                            dialogueText={item.content.mangaPhotoDescription.dialogue_hiragana_katakana}
                            position={item.content.position}
                        />
                    );
                    case 'images_together':
                        const { imageRight, imageLeft } = item.content; // Деструктуризація для зручності
                    
                        return (
                            <View key={`image_together-${index}`} style={styles.container}>
                            <View style={styles.leftImageContainer}>
                                <View style={styles.bubble}>
                                    <Text style={styles.bubbleText}>{imageLeft.mangaPhotoDescription.dialogue_hiragana_katakana}</Text>
                                    <View style={styles.arrow} />
                                </View>
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${imageLeft.imageData}` }}
                                    style={styles.image}
                                />
                            </View>
                            <View style={styles.rightImageContainer}>
                                <View style={styles.bubble}>
                                    <Text style={styles.bubbleText}>{imageRight.mangaPhotoDescription.dialogue_hiragana_katakana}</Text>
                                    <View style={styles.arrow} />
                                </View>
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${imageRight.imageData}` }}
                                    style={styles.image}
                                />
                            </View>
                        </View>
                        );
                    
                case 'question':
                    return (
                        <QuestionComponent key={`question-${index}`} question={item.content} />
                    );
                default:
                    return null;
            }
        }
    };

    render() {
        return (
            <ScrollView style={mainStyles .container}>
                <TouchableOpacity onPress={this.toggleDisplayType} style={mainStyles .toggleButton}>
                    <Text style={mainStyles .toggleButtonText}>
                        {this.state.displayType.charAt(0).toUpperCase() + this.state.displayType.slice(1)}
                    </Text>
                </TouchableOpacity>

                {this.state.displayedContent.map((item, index) => this.renderContent(item, index))}

                {this.state.contentList.length > 0 ? (
                    <TouchableOpacity onPress={this.handleNextContent} style={mainStyles .nextButton}>
                        <Text style={mainStyles .nextButtonText}>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => console.log("Finished reading!")}
                        style={mainStyles .nextButton}
                    >
                        <Text style={mainStyles .nextButtonText}>Finish</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        );
    }
}

export default MangaScreen;
