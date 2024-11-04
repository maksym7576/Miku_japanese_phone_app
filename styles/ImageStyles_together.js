import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const imageWidth = width * 0.7;

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: 20,
        marginHorizontal: 10,
    },
    leftImageContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50,
        position: 'relative',
    },
    rightImageContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50,
        position: 'relative',
    },
    image: {
        width: imageWidth / 2,
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
        textAlign: 'center',
        width: '100%', // Текст займає всю ширину бульбашки
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