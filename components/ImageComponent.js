// components/ImageComponent.js
import React from 'react';
import { View, Image, Text } from 'react-native';
import imageStyles  from '../styles/imageStyles';

const ImageComponent = ({ imageSource, dialogueText, position }) => {
    const isCenter = position === 'center';
    const bubbleStyle = [
        imageStyles .bubble,
        isCenter ? imageStyles .centerBubble : position === 'left' ? imageStyles .leftBubble : imageStyles .rightBubble,
    ];
    const imageContainerStyle = [
        imageStyles .imageContainer,
        isCenter ? imageStyles .centerImageContainer : position === 'left' ? imageStyles .leftImageContainer : imageStyles .rightImageContainer,
    ];
    const imageStyle = [imageStyles .image, !isCenter && imageStyles .halfImage];

    return (
        <View style={imageContainerStyle}>
            <Image source={{ uri: imageSource }} style={imageStyle} />
            <View style={bubbleStyle}>
                <Text style={imageStyles .bubbleText}>{dialogueText}</Text>
                <View style={imageStyles .arrow} />
            </View>
        </View>
    );
};

export default ImageComponent;
