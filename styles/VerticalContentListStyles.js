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
        marginVertical: 20,
        marginHorizontal: 10,
        position: 'relative',
    },
    centerImageContainer: {
        alignItems: 'center',
    },
    leftImageContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    rightImageContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    image: {
        width: imageWidth, // стандартна ширина для центрованих зображень
        height: undefined,
        aspectRatio: 1,
        borderRadius: 8,
    },
    halfImage: {
        width: imageWidth / 2, // зменшена ширина для лівої та правої позицій
    },
    bubble: {
        position: 'absolute',
        bottom: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        zIndex: 1,
    },
    bubbleText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    arrow: {
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: [{ translateX: -5 }],
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderLeftColor: 'transparent',
        borderRightWidth: 10,
        borderRightColor: 'transparent',
        borderTopWidth: 10,
        borderTopColor: '#fff',
    },
    leftBubble: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        width: '45%',
    },
    rightBubble: {
        alignSelf: 'flex-end',
        marginRight: 10,
        width: '45%',
    },
    centerBubble: {
        alignSelf: 'center',
        width: '80%',
    },
    arrow: {
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: [{ translateX: -5 }],
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderLeftColor: 'transparent',
        borderRightWidth: 10,
        borderRightColor: 'transparent',
        borderTopWidth: 10,
        borderTopColor: '#fff',
    },
    leftBubble: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        width: '45%',
    },
    rightBubble: {
        alignSelf: 'flex-end',
        marginRight: 10,
        width: '45%',
    },
    centerBubble: {
        alignSelf: 'center',
        width: '80%',
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
    positionButton: {
        padding: 12,
        backgroundColor: '#34A853',
        borderRadius: 8,
        alignItems: 'center',
        margin: 10,
    },
    positionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
