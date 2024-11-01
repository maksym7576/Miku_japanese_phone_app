import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/VerticalContentListStyles';

const DialogueComponent = ({ dialogue }) => {
    const [displayType, setDisplayType] = useState('original');
    const [isTranslationVisible, setIsTranslationVisible] = useState(false);

    const displayTypes = ['original', 'hiragana', 'romanji'];

    const toggleDisplayType = () => {
        const currentIndex = displayTypes.indexOf(displayType);
        setDisplayType(displayTypes[(currentIndex + 1) % displayTypes.length]);
    };

    const getDisplayText = (type) => {
        const typeMap = {
            'original': dialogue.dialogue_hiragana_katakana_kanji,
            'hiragana': dialogue.dialogue_hiragana_katakana,
            'romanji': dialogue.dialogue_romanji,
        };
        return typeMap[type] || typeMap['original'];
    };

    return (
        <View style={styles.dialogueContainer}>
            <TouchableOpacity 
                onPress={toggleDisplayType} 
                style={styles.typeToggleButton}
            >
                <Text style={styles.toggleButtonText}>
                    {displayType.charAt(0).toUpperCase() + displayType.slice(1)}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => setIsTranslationVisible(!isTranslationVisible)} 
                style={styles.dialogueTextContainer}
            >
                <Text style={styles.dialogueText}>
                    {getDisplayText(displayType)}
                </Text>
            </TouchableOpacity>

            {isTranslationVisible && (
                <View style={styles.translationContainer}>
                    <Text style={styles.translationText}>
                        {dialogue.translation}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default DialogueComponent;