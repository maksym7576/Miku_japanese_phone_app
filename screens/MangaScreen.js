import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import styles from '../styles/VerticalContentListStyles';
import DialogueComponent from '../components/DialogueComponent';
import QuestionComponent from '../components/QuestionComponent';

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
            console.log("New display type:", newType);
            return { displayType: newType };
        });
    };

 handleNextContent = () => {
    if (this.state.contentList.length > 0) {
        const [nextContent, ...remainingContent] = this.state.contentList;

        // Перевіряємо, чи є наступні два елементи зображеннями з `left` і `right`
        if (
            nextContent.type === 'image' &&
            remainingContent[0] &&
            remainingContent[0].type === 'image' &&
            nextContent.content.position === 'left' &&
            remainingContent[0].content.position === 'right'
        ) {
            // Додаємо обидва зображення з позиціями `left` і `right` в один рядок
            this.setState((prevState) => ({
                displayedContent: [
                    ...prevState.displayedContent,
                    { left: nextContent, right: remainingContent[0] }
                ],
                contentList: remainingContent.slice(1), // Видаляємо два елементи
            }));
        } else {
            // Звичайне додавання контенту
            this.setState((prevState) => ({
                displayedContent: [...prevState.displayedContent, nextContent],
                contentList: remainingContent,
            }));
        }
    }
};

renderContent = (item, index) => {
    if (item.left && item.right) {
        // Якщо `item` містить обидва зображення `left` та `right`, відображаємо їх поруч
        return (
            <View key={`pair-${index}`} style={styles.imageRowContainer}>
                <View style={[styles.imageContainer, styles.leftImage]}>
                    <Image source={{ uri: `data:image/jpeg;base64,${item.left.content.imageData}` }} style={styles.image} />
                    <View style={[styles.bubble, styles.leftBubble]}>
                        <Text style={styles.bubbleText}>{item.left.content.mangaPhotoDescription.dialogue_hiragana_katakana}</Text>
                    </View>
                </View>
                <View style={[styles.imageContainer, styles.rightImage]}>
                    <Image source={{ uri: `data:image/jpeg;base64,${item.right.content.imageData}` }} style={styles.image} />
                    <View style={[styles.bubble, styles.rightBubble]}>
                        <Text style={styles.bubbleText}>{item.right.content.mangaPhotoDescription.dialogue_hiragana_katakana}</Text>
                    </View>
                </View>
            </View>
        );
    } else {
        // Інші випадки
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
                    <View key={`manga-${index}`} style={styles.mangaHeader}>
                        <Text style={styles.mangaTitle}>{item.content.name}</Text>
                        <Text style={styles.startDialogue}>{item.content.startDialogue}</Text>
                    </View>
                );
                case 'image':
                    const imageSource = `data:image/jpeg;base64,${item.content.imageData}`;
                    const dialogueText = item.content.mangaPhotoDescription;
                
                    let bubbleStyle = [styles.bubble];
                    let imageContainerStyle = [styles.imageContainer];
                    let imageStyle = [styles.image];
                
                    if (item.content.position === 'center') {
                        bubbleStyle.push(styles.centerBubble);
                        imageContainerStyle.push(styles.centerImageContainer);
                    } else {
                        bubbleStyle.push(
                            item.content.position === 'left' ? styles.leftBubble : styles.rightBubble
                        );
                        imageContainerStyle.push(
                            item.content.position === 'left' ? styles.leftImageContainer : styles.rightImageContainer
                        );
                        imageStyle.push(styles.halfImage); // зменшуємо зображення вдвічі для лівої/правої позицій
                    }
                
                    return (
                        <View key={`image-${index}`} style={imageContainerStyle}>
                            <Image source={{ uri: imageSource }} style={imageStyle} />
                            <View style={bubbleStyle}>
                                <Text style={styles.bubbleText}>{dialogueText.dialogue_hiragana_katakana}</Text>
                                <View style={styles.arrow} />
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
            <ScrollView style={styles.container}>
                <TouchableOpacity onPress={this.toggleDisplayType} style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>
                        {this.state.displayType.charAt(0).toUpperCase() + this.state.displayType.slice(1)}
                    </Text>
                </TouchableOpacity>

                {this.state.displayedContent.map((item, index) => this.renderContent(item, index))}

                {this.state.contentList.length > 0 ? (
                    <TouchableOpacity onPress={this.handleNextContent} style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            console.log("Finished reading!");
                        }}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextButtonText}>Finish</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        );
    }
}

export default MangaScreen;
