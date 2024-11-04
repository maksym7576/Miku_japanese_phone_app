// components/ImageComponent.js
import React from 'react';
import { View, Image, Text } from 'react-native';
import imageStyles from '../styles/imageStyles';

const ImageComponent = ({ imageSource, dialogueText }) => {
    const bubbleStyle = [imageStyles.bubble, imageStyles.centerBubble];
    const imageContainerStyle = [imageStyles.imageContainer, imageStyles.centerImageContainer];
    const imageStyle = [imageStyles.image];

    return (
        <View style={imageContainerStyle}>
            <Image source={{ uri: imageSource }} style={imageStyle} />
            <View style={bubbleStyle}>
                <Text style={imageStyles.bubbleText}>{dialogueText}</Text>
                <View style={imageStyles.arrow} />
            </View>
        </View>
    );
};

export default ImageComponent;
