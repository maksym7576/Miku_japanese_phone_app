import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const imageWidth = width * 0.7;

export default StyleSheet.create({
    imageContainer: {
        marginVertical: 20,
        marginHorizontal: 10,
        marginTop: 60,
        position: 'relative',
        alignItems: 'center', // центрування контейнера зображення
    },
    image: {
        width: imageWidth,
        height: undefined,
        aspectRatio: 1,
        borderRadius: 8,
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
        width: imageWidth / 2, // Встановлюємо ширину бульбашки рівною ширині фотографії
        alignSelf: 'center',
        marginBottom: 5,
    },
    bubbleText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center', // Залишаємо вирівнювання по центру
        flexWrap: 'wrap', // Дозволяємо тексту переноситися
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
});