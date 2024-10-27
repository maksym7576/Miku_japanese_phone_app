import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelSection: {
        marginBottom: 24,
    },
    levelTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    lessonItem: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        marginVertical: 6,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    lessonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    lessonSubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default styles;