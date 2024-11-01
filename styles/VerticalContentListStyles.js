import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const imageWidth = width * 0.7;

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
        position: 'relative', // Required for positioning the bubble relative to the image
    },
    image: {
        width: imageWidth,
        height: undefined,
        aspectRatio: 1,
        borderRadius: 8,
    },
    bubble: {
        position: 'absolute',
        bottom: '100%', // Position the bubble above the image
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        zIndex: 1, // Ensure the bubble is above the image
    },
    bubbleText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    arrow: {
        position: 'absolute',
        top: '100%', // Position the arrow at the bottom of the bubble
        left: '50%',
        transform: [{ translateX: -5 }], // Center the arrow
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderLeftColor: 'transparent',
        borderRightWidth: 10,
        borderRightColor: 'transparent',
        borderTopWidth: 10,
        borderTopColor: '#fff', // Color of the arrow (same as the bubble)
    },
    // Specific styles for bubble positioning based on alignment
    leftBubble: {
        left: 10, // Distance from the left side
        width: '60%', // Width of the bubble for left position
    },
    rightBubble: {
        right: 10, // Distance from the right side
        width: '60%', // Width of the bubble for right position
    },
    centerBubble: {
        left: '50%',
        transform: [{ translateX: -50 }], // Center the bubble
        width: '80%', // Wider for center position
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
