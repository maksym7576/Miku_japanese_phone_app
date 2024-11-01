import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import styles from '../styles/VerticalContentListStyles';
import DialogueComponent from '../components/DialogueComponent';
import QuestionComponent from '../components/QuestionComponent';

const MangaScreen = ({ route }) => {
    const { mangaData } = route.params;
    const [contentList, setContentList] = useState(mangaData || []);
    const [displayedContent, setDisplayedContent] = useState([]);
    
    const [displayType, setDisplayType] = useState('original');
    const displayTypes = ['original', 'hiragana', 'romanji'];

    const toggleDisplayType = () => {
        const currentIndex = displayTypes.indexOf(displayType);
        setDisplayType(displayTypes[(currentIndex + 1) % displayTypes.length]);
    };

    const handleNextContent = () => {
        if (contentList.length > 0) {
            const [nextContent, ...remainingContent] = contentList;
            setDisplayedContent(prev => [...prev, nextContent]);
            setContentList(remainingContent);
        }
    };

    const renderContent = (item) => {
        switch (item.type) {
            case 'dialogue':
                return (
                    <DialogueComponent 
                        key={item.content.id} 
                        dialogue={item.content} 
                        displayType={displayType}
                    />
                );
            // Інші типи контенту залишаються без змін
            case 'manga':
                return (
                    <View key={item.content.id} style={styles.mangaHeader}>
                        <Text style={styles.mangaTitle}>{item.content.name}</Text>
                        <Text style={styles.startDialogue}>{item.content.startDialogue}</Text>
                    </View>
                );
            case 'image':
                const imageSource = `data:image/jpeg;base64,${item.content.imageData}`;
                return (
                    <View key={item.content.id} style={styles.imageContainer}>
                        <Image source={{ uri: imageSource }} style={styles.image} />
                        <Text style={styles.imageText}>{item.content.caption || `Image ${item.content.id}`}</Text>
                    </View>
                );
            case 'question':
                return (
                    <QuestionComponent key={item.content.id} question={item.content} />
                );
            default:
                return null;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity 
                onPress={toggleDisplayType} 
                style={styles.toggleButton}
            >
                <Text style={styles.toggleButtonText}>
                    {displayType.charAt(0).toUpperCase() + displayType.slice(1)}
                </Text>
            </TouchableOpacity>

            {displayedContent.map(item => renderContent(item))}

            {contentList.length > 0 ? (
                <TouchableOpacity 
                    onPress={handleNextContent} 
                    style={styles.nextButton}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity 
                    onPress={() => {/* Ваша логіка переадресації */}} 
                    style={styles.nextButton}
                >
                    <Text style={styles.nextButtonText}>Finish</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

export default MangaScreen;