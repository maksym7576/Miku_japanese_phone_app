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
        alignItems: 'center', // Вирівнюємо контент по центру
        position: 'relative', // Додаємо позицію для контролю бульбашки
    },
    rightImageContainer: {
        flex: 1,
        alignItems: 'center', // Вирівнюємо контент по центру
        position: 'relative', // Додаємо позицію для контролю бульбашки
    },
    image: {
        width: imageWidth / 2, // Зменшена ширина для лівої та правої позицій
        height: undefined,
        aspectRatio: 1,
        borderRadius: 8,
    },
    bubble: {
        position: 'absolute',
        bottom: '100%', // Розміщуємо бульбашку над зображенням
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        zIndex: 1,
        width: 'auto', // Або вкажіть бажану ширину
        alignSelf: 'center', // Вирівнюємо по центру
        marginBottom: 5, // Додаємо невеликий відступ для відстані до зображення
    },
    bubbleText: {
        fontSize: 14, // Зменшений розмір тексту
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
});
