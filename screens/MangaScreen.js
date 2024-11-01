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
        this.setState((prevState) => ({
            displayedContent: [
                ...prevState.displayedContent,
                { ...nextContent, position: prevState.currentPosition === 'left' ? 'right' : 'left' }
            ],
            contentList: remainingContent,
            currentPosition: prevState.currentPosition === 'left' ? 'right' : 'left',
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
                return (
                    <View key={`manga-${index}`} style={styles.mangaHeader}>
                        <Text style={styles.mangaTitle}>{item.content.name}</Text>
                        <Text style={styles.startDialogue}>{item.content.startDialogue}</Text>
                    </View>
                );
            case 'image':
                const imageSource = `data:image/jpeg;base64,${item.content.imageData}`;
                const dialogueText = item.content.mangaPhotoDescription;
    
                // Determine bubble and image container style based on the position field
                let bubbleStyle = [styles.bubble];
                let imageContainerStyle = [styles.imageContainer];
    
                if (item.content.position === 'left') {
                    bubbleStyle.push(styles.leftBubble);
                    imageContainerStyle.push(styles.leftImage);
                } else if (item.content.position === 'right') {
                    bubbleStyle.push(styles.rightBubble);
                    imageContainerStyle.push(styles.rightImage);
                } else {
                    bubbleStyle.push(styles.centerBubble);
                    imageContainerStyle.push(styles.centerImage);
                }
    
                return (
                    <View key={`image-${index}`} style={imageContainerStyle}>
                        <Image source={{ uri: imageSource }} style={styles.image} />
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
