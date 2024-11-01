import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const imageWidth = width * 0.9;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mangaHeader: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    mangaTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: '#333',
    },
    startDialogue: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#666',
    },
    imageContainer: {
        alignItems: 'center',
        margin: 8,
    },
    image: {
        width: imageWidth,
        height: undefined,
        aspectRatio: 1,
        borderRadius: 8,
    },
    imageText: {
        position: 'absolute',
        bottom: 8,
        width: '90%',
        textAlign: 'center',
        fontSize: 14,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    toggleButton: {
        padding: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        alignItems: 'center',
        margin: 10,
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    nextButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        alignSelf: 'center',
        margin: 10,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
