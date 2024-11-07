import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import imageStyles from '../styles/imageStyles';

class ImageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTranslationVisible: false,
        };
    }

    getDisplayText = (photoDescription = {}, type) => {
        const typeMap = {
            original: photoDescription.dialogue_hiragana_katakana_kanji || '',
            hiragana: photoDescription.dialogue_hiragana_katakana || '',
            romanji: photoDescription.dialogue_romanji || '',
        };
        
        return typeMap[type] || typeMap.original;
    };

    toggleTranslation = () => {
        this.setState(prevState => ({
            isTranslationVisible: !prevState.isTranslationVisible,
        }));
    };

    render() {
        const { imageSource, photoDescription, displayType } = this.props;
        const { isTranslationVisible } = this.state;

        return (
            <View style={imageStyles.imageContainer}>
                 <TouchableOpacity onPress={this.toggleTranslation} style={{ alignItems: 'center' }}>
                    <View style={[imageStyles.bubble, { alignItems: 'center' }]}>
                        <Text style={imageStyles.bubbleText}>
                            {this.getDisplayText(photoDescription, displayType)}
                        </Text>
                        {isTranslationVisible && photoDescription?.translation && (
                            <Text style={[imageStyles.bubbleText, { color: '#666', marginTop: 5 }]}>
                                {photoDescription.translation}
                            </Text>
                        )}
                        <View style={imageStyles.arrow} />
                    </View>
                </TouchableOpacity>
                <Image source={{ uri: imageSource }} style={imageStyles.image} />
            </View>
        );
    }
}

export default ImageComponent;
