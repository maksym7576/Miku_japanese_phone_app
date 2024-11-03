import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import mainStyles  from '../styles/MainScreenStyles';

class DialogueComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTranslationVisible: false,
        };
    }

    toggleTranslationVisibility = () => {
        this.setState((prevState) => ({
            isTranslationVisible: !prevState.isTranslationVisible,
        }));
    };

    getDisplayText = (type) => {
        const { dialogue } = this.props;
        const typeMap = {
            'original': dialogue.dialogue_hiragana_katakana_kanji,
            'hiragana': dialogue.dialogue_hiragana_katakana,
            'romanji': dialogue.dialogue_romanji,
        };
        return typeMap[type] || typeMap['original'];
    };

    render() {
        const { displayType, dialogue } = this.props;
        return (
            <View style={mainStyles .dialogueContainer}>
                <TouchableOpacity 
                    onPress={this.toggleTranslationVisibility} 
                    style={mainStyles .dialogueTextContainer}
                >
                    <Text style={mainStyles .dialogueText}>
                        {this.getDisplayText(displayType)}
                    </Text>
                </TouchableOpacity>

                {this.state.isTranslationVisible && (
                    <View style={mainStyles .translationContainer}>
                        <Text style={mainStyles .translationText}>
                            {dialogue.translation}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
}

export default DialogueComponent;
