import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/ImageStyles_together';

class ImagesTogethterComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLeftTranslationVisible: false,
            isRightTranslationVisible: false
        };
    }

    getDisplayText = (photoDescription, type) => {
        const typeMap = {
            'original': photoDescription.dialogue_hiragana_katakana_kanji,
            'hiragana': photoDescription.dialogue_hiragana_katakana,
            'romanji': photoDescription.dialogue_romanji
        };
        return typeMap[type] || typeMap['original'];
    };

    toggleLeftTranslation = () => {
        this.setState(prevState => ({
            isLeftTranslationVisible: !prevState.isLeftTranslationVisible
        }));
    };

    toggleRightTranslation = () => {
        this.setState(prevState => ({
            isRightTranslationVisible: !prevState.isRightTranslationVisible
        }));
    };

    renderBubble = (photoDescription, isTranslationVisible, toggleTranslation) => {
        const { displayType } = this.props;
        
        return (
            <TouchableOpacity onPress={toggleTranslation}>
                <View style={styles.bubble}>
                    <Text style={styles.bubbleText}>
                        {this.getDisplayText(photoDescription, displayType)}
                    </Text>
                    {isTranslationVisible && (
                        <Text style={[styles.bubbleText, { color: '#666', marginTop: 5 }]}>
                            {photoDescription.translation}
                        </Text>
                    )}
                    <View style={styles.arrow} />
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const { imageLeft, imageRight } = this.props.content;
        const { isLeftTranslationVisible, isRightTranslationVisible } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.leftImageContainer}>
                    {this.renderBubble(
                        imageLeft.mangaPhotoDescription,
                        isLeftTranslationVisible,
                        this.toggleLeftTranslation
                    )}
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${imageLeft.image.imageData}` }}
                        style={styles.image}
                    />
                </View>
                <View style={styles.rightImageContainer}>
                    {this.renderBubble(
                        imageRight.mangaPhotoDescription,
                        isRightTranslationVisible,
                        this.toggleRightTranslation
                    )}
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${imageRight.image.imageData}` }}
                        style={styles.image}
                    />
                </View>
            </View>
        );
    }
}

export default ImagesTogethterComponent;