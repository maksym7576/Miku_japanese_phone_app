import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const imageWidth = width * 0.7;

export default StyleSheet.create({
  imageContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
    marginTop: 60,
    position: 'relative',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  imageWrapper: {
    position: 'relative',
    width: imageWidth,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  bubbleContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: '100%',
    zIndex: 1,
    marginBottom: 5,
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    width: imageWidth / 2,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  bubbleText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    flexWrap: 'wrap',
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: 'center',
      },
    }),
  },
  translationText: {
    color: '#666',
    marginTop: 5,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },
  arrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: [{ translateX: -10 }],
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: '#fff',
  },
  soundButton: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 2,
    ...Platform.select({
      android: {
        elevation: 5,
      },
    }),
  },
  soundButtonBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
    ...Platform.select({
      android: {
        backgroundColor: '#000000aa', // більш сумісний формат для Android
      },
    }),
  },
  soundIcon: {
    fontSize: 30,
    color: '#fff',
    ...Platform.select({
      android: {
        textAlign: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  // Додаткові стилі для обробки помилок завантаження
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },
});