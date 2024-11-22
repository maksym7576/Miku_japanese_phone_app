import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const LessonResultPanel = ({ results, onClose }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const navigation = useNavigation();

    const handleImagePress = (item) => {
        setSelectedItem(selectedItem === item ? null : item);
    };

    const navigateToLessons = async () => {
        try {
            await AsyncStorage.removeItem('quizResults'); 
            navigation.navigate('Lessons'); 
        } catch (error) {
            Alert.alert('Error', 'Failed to remove quiz results');
        }
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <Text style={styles.title}>Lesson Results</Text>
                
                {results && results.length > 0 ? (
                    results.map((result, index) => (
                        <View key={index} style={styles.resultItem}>
                            {result.type === 'Percentage' && (
                                <View style={styles.progressContainer}>
                                    <View style={[styles.progressBar, { width: `${result.reward}%` }]} />
                                    <View style={[styles.remainingBar, { width: `${100 - result.reward}%` }]} />
                                    <Text style={styles.progressText}>{result.reward}%</Text>
                                </View>
                            )}
                            
                            {result.type === 'Experience' && (
                                <Text style={styles.rewardValue}>Reward: {result.reward} XP</Text>
                            )}
                            
                            {result.type === 'Item' && result.reward && (
                                <TouchableOpacity onPress={() => handleImagePress(result)}>
                                    <Image
                                        source={{ uri: `data:image/jpeg;base64,${result.image.imageData}` }}
                                        style={styles.rewardImage}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            )}

                            {selectedItem === result && result.reward && (
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName}>{result.reward.name}</Text>
                                    <Text style={styles.itemDescription}>{result.reward.description}</Text>
                                    <Text style={styles.itemType}>{result.reward.type}</Text>
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <Text style={styles.noResults}>No results available.</Text>
                )}

                <TouchableOpacity onPress={navigateToLessons} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Go to Lessons</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
    },
    container: {
        width: '90%',
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    resultItem: {
        marginBottom: 15,
        alignItems: 'center',
    },
    progressContainer: {
        width: '100%',
        height: 30,
        backgroundColor: '#ddd',
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBar: {
        position: 'absolute',
        left: 0,
        height: '100%',
        backgroundColor: 'green',
        borderRadius: 15,
    },
    remainingBar: {
        position: 'absolute',
        right: 0,
        height: '100%',
        backgroundColor: 'red',
        borderRadius: 15,
    },
    progressText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        zIndex: 1,
    },
    rewardImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginVertical: 8,
        borderColor: '#ddd',
        borderWidth: 2,
    },
    itemDetails: {
        marginTop: 5,
        alignItems: 'center',
    },
    itemName: {
        fontWeight: '600',
    },
    itemDescription: {
        fontStyle: 'italic',
        textAlign: 'center',
    },
    itemType: {
        fontSize: 12,
        color: '#888',
    },
    noResults: {
        fontSize: 16,
        color: '#888',
    },
    closeButton: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default LessonResultPanel;
