import { StyleSheet, Dimensions, Platform } from 'react-native';

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
    marginRight: 10, // Add space between the two image containers
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
  rightImageContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
    position: 'relative',
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
    width: imageWidth / 2,
    alignSelf: 'center',
    zIndex: 1,
    marginBottom: 5,
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
    width: '100%',
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
        backgroundColor: '#000000aa', // Android-specific background color
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
  // Error handling styles
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
