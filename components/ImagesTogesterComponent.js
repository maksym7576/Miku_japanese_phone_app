import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/ImageStyles_together';

class ImagesTogethterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLeftTranslationVisible: false,
      isRightTranslationVisible: false,
      isLeftAudioPlaying: false,
      isRightAudioPlaying: false,
      isLeftAudioAvailable: false,
      isRightAudioAvailable: false,
      leftSound: null,
      rightSound: null,
      imageError: false,
    };
  }

  componentDidMount() {
    const { imageLeft, imageRight } = this.props.content;
    // Check if audio is available for both images
    if (imageLeft.audio?.audioData) {
      this.setState({ isLeftAudioAvailable: true });
    }
    if (imageRight.audio?.audioData) {
      this.setState({ isRightAudioAvailable: true });
    }

    this.loadAudio();
  }

  componentWillUnmount() {
    if (this.state.leftSound) {
      this.state.leftSound.unloadAsync();
    }
    if (this.state.rightSound) {
      this.state.rightSound.unloadAsync();
    }
  }

  loadAudio = async () => {
    const { imageLeft, imageRight } = this.props.content;

    if (imageLeft.audio?.audioData) {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    }

    if (imageRight.audio?.audioData) {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    }
  };

  getDisplayText = (photoDescription, type) => {
    const typeMap = {
      'original': photoDescription.dialogue_hiragana_katakana_kanji,
      'hiragana': photoDescription.dialogue_hiragana_katakana,
      'romanji': photoDescription.dialogue_romanji
    };
    return typeMap[type] || typeMap['original'];
  };

  toggleLeftTranslation = () => {
    this.setState(prevState => ({
      isLeftTranslationVisible: !prevState.isLeftTranslationVisible,
    }));
  };

  toggleRightTranslation = () => {
    this.setState(prevState => ({
      isRightTranslationVisible: !prevState.isRightTranslationVisible,
    }));
  };

  playLeftAudio = async () => {
    try {
      const { imageLeft } = this.props.content;
      const { isLeftAudioPlaying, leftSound } = this.state;

      if (isLeftAudioPlaying && leftSound) {
        await leftSound.stopAsync();
        this.setState({ isLeftAudioPlaying: false });
        return;
      }

      if (leftSound) {
        await leftSound.replayAsync();
      } else {
        const audioUrl = `data:audio/mp3;base64,${imageLeft.audio.audioData}`;
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            this.setState({ isLeftAudioPlaying: false });
          }
        });
        this.setState({ leftSound: sound, isLeftAudioPlaying: true });
      }
    } catch (error) {
      console.error('Error playing left audio:', error);
    }
  };

  playRightAudio = async () => {
    try {
      const { imageRight } = this.props.content;
      const { isRightAudioPlaying, rightSound } = this.state;

      if (isRightAudioPlaying && rightSound) {
        await rightSound.stopAsync();
        this.setState({ isRightAudioPlaying: false });
        return;
      }

      if (rightSound) {
        await rightSound.replayAsync();
      } else {
        const audioUrl = `data:audio/mp3;base64,${imageRight.audio.audioData}`;
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            this.setState({ isRightAudioPlaying: false });
          }
        });
        this.setState({ rightSound: sound, isRightAudioPlaying: true });
      }
    } catch (error) {
      console.error('Error playing right audio:', error);
    }
  };

  handleImageError = () => {
    this.setState({ imageError: true });
  };

  render() {
    const { imageLeft, imageRight } = this.props.content;
    const {
      isLeftTranslationVisible,
      isRightTranslationVisible,
      isLeftAudioAvailable,
      isRightAudioAvailable,
      isLeftAudioPlaying,
      isRightAudioPlaying,
      imageError,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.leftImageContainer}>
          {this.renderBubble(imageLeft.mangaPhotoDescription, isLeftTranslationVisible, this.toggleLeftTranslation)}
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageLeft.image.imageData}` }}
            style={styles.image}
            onError={this.handleImageError}
          />
          {isLeftAudioAvailable && (
            <TouchableOpacity onPress={this.playLeftAudio} style={styles.soundButton} activeOpacity={0.7}>
              <View style={styles.soundButtonBackground}>
                <Ionicons
                  name={isLeftAudioPlaying ? 'pause-circle' : 'play-circle'}
                  style={styles.soundIcon}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.rightImageContainer}>
          {this.renderBubble(imageRight.mangaPhotoDescription, isRightTranslationVisible, this.toggleRightTranslation)}
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageRight.image.imageData}` }}
            style={styles.image}
            onError={this.handleImageError}
          />
          {isRightAudioAvailable && (
            <TouchableOpacity onPress={this.playRightAudio} style={styles.soundButton} activeOpacity={0.7}>
              <View style={styles.soundButtonBackground}>
                <Ionicons
                  name={isRightAudioPlaying ? 'pause-circle' : 'play-circle'}
                  style={styles.soundIcon}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {imageError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Помилка завантаження зображення</Text>
          </View>
        )}
      </View>
    );
  }

  renderBubble = (photoDescription, isTranslationVisible, toggleTranslation) => {
    const { displayType } = this.props;
    return (
      <TouchableOpacity onPress={toggleTranslation}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>
            {this.getDisplayText(photoDescription, displayType)}
          </Text>
          {isTranslationVisible && (
            <Text style={[styles.bubbleText, { color: '#666', marginTop: 5 }]}>
              {photoDescription.translation}
            </Text>
          )}
          <View style={styles.arrow} />
        </View>
      </TouchableOpacity>
    );
  };
}

export default ImagesTogethterComponent;
