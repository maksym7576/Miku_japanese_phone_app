import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/imageStyles';

const ImageComponent = ({ imageSource, photoDescription, displayType, content }) => {
  const [isTranslationVisible, setTranslationVisible] = useState(false);
  const [isAudioPlaying, setAudioPlaying] = useState(false);
  const [isAudioAvailable, setAudioAvailable] = useState(false);
  const [sound, setSound] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const { audio } = content;
    if (audio?.audioData) {
      setAudioAvailable(true);
    }

    const loadAudio = async () => {
      if (audio?.audioData) {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      }
    };

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [content]);

  const getDisplayText = (photoDescription = {}, type) => {
    const typeMap = {
      original: photoDescription.kanji || '',
      hiragana: photoDescription.hiragana_or_katakana || '',
      romanji: photoDescription.romanji || '',
    };
    return typeMap[type] || typeMap.original;
  };

  const toggleTranslation = () => {
    setTranslationVisible(prev => !prev);
  };

  const playAudio = async () => {
    try {
      const { audio } = content;

      if (isAudioPlaying && sound) {
        await sound.stopAsync();
        setAudioPlaying(false);
        return;
      }

      if (sound) {
        await sound.replayAsync();
      } else {
        const audioUrl = `data:audio/mp3;base64,${audio.audioData}`;
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );

        newSound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            setAudioPlaying(false);
          }
        });

        setSound(newSound);
      }

      setAudioPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={toggleTranslation} style={styles.bubbleContainer}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>
            {getDisplayText(photoDescription, displayType)}
          </Text>
          {isTranslationVisible && photoDescription?.translation && (
            <Text style={[styles.bubbleText, styles.translationText]}>
              {photoDescription.translation}
            </Text>
          )}
          <View style={styles.arrow} />
        </View>
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: imageSource }} 
          style={styles.image}
          onError={handleImageError}
        />
        
        {isAudioAvailable && (
          <TouchableOpacity 
            onPress={playAudio} 
            style={styles.soundButton}
            activeOpacity={0.7}
          >
            <View style={styles.soundButtonBackground}>
              <Ionicons
                name={isAudioPlaying ? 'pause-circle' : 'play-circle'}
                style={styles.soundIcon}
              />
            </View>
          </TouchableOpacity>
        )}

        {imageError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Помилка завантаження зображення</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ImageComponent;
