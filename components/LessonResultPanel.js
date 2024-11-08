import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const LessonResultPanel = ({ results, onClose }) => {
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <Text style={styles.title}>Lesson Results</Text>
                
                {results && results.length > 0 ? (
                    results.map((result, index) => (
                        <View key={index} style={styles.resultItem}>
                            <Text style={styles.rewardType}>{result.type}</Text>
                            {result.type === 'Percentage' && (
                                <Text style={styles.rewardValue}>Reward: {result.reward}%</Text>
                            )}
                            {result.type === 'Experience' && (
                                <Text style={styles.rewardValue}>Reward: {result.reward} XP</Text>
                            )}
                            {result.type === 'Item' && result.reward && (
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName}>{result.reward.name}</Text>
                                    <Text style={styles.itemDescription}>{result.reward.description}</Text>
                                    <Text style={styles.itemType}>{result.reward.type}</Text>
                                </View>
                            )}
                            {result.image && result.image.imageData && (
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${result.image.imageData}` }}
                                    style={styles.rewardImage}
                                />
                            )}
                        </View>
                    ))
                ) : (
                    <Text style={styles.noResults}>No results available.</Text>
                )}

                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // темний напівпрозорий фон
        zIndex: 1000,  // високий zIndex, щоб бути поверх усіх інших елементів
    },
    container: {
        width: '80%',
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
    },
    rewardType: {
        fontSize: 16,
        fontWeight: '600',
    },
    rewardValue: {
        fontSize: 14,
        marginVertical: 4,
    },
    rewardImage: {
        width: 50,
        height: 50,
        marginVertical: 5,
    },
    itemDetails: {
        marginTop: 5,
    },
    itemName: {
        fontWeight: '600',
    },
    itemDescription: {
        fontStyle: 'italic',
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
