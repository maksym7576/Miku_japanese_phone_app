import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Audio, Video } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MediaComponent = ({ mediaType, fileRecordsList}) => {
  const [soundState, setSoundState] = useState({ sound: null, isPlaying: false, progress: 0 });
  const [videoState, setVideoState] = useState({ isPlaying: false, progress: 0 });
  const videoRef = useRef(null);

  useEffect(() => {
    const handleMedia = async () => {
      if (mediaType === 'image_and_audio') {
        const audioFile = fileRecordsList.find((file) => file.type === 'audio');
        if (audioFile) {
          setTimeout(() => playAudio(audioFile.url), 500); // Виклик з затримкою 0.5 секунди
        }
      }
      if (mediaType === 'video') {
        setTimeout(playVideo, 500); // Виклик з затримкою 0.5 секунди
      }
    };
  
    handleMedia();
  
    return () => {
      stopAudio(); // Зупинити аудіо при зміні
      stopVideo(); // Зупинити відео при зміні
    };
  }, [mediaType, fileRecordsList]);
  
  

  const playAudio = async (audioUrl) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            if (status.isPlaying) {
              const progress = (status.positionMillis / status.durationMillis) * 100;
              setSoundState((prevState) => ({ ...prevState, progress }));
            } else if (status.didJustFinish) {
              setSoundState({ sound: null, isPlaying: false, progress: 100 });
              setTimeout(() => setSoundState({ sound: null, isPlaying: false, progress: 0 }), 500);
            }
          }
        }
      );
      setSoundState({ sound, isPlaying: true, progress: 0 });
    } catch (error) {
      console.error('Error playing audio', error);
    }
  };

  const stopAudio = async () => {
    if (soundState.sound) {
      await soundState.sound.stopAsync();
      setSoundState({ sound: null, isPlaying: false, progress: 0 });
    }
  };

  const playVideo = async () => {
    try {
      if (videoRef.current) {
        setVideoState({ isPlaying: true, progress: 0 });
        await videoRef.current.stopAsync();
        await videoRef.current.setPositionAsync(0);
        await videoRef.current.playAsync();
      }
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };

  const stopVideo = async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.pauseAsync();
        await videoRef.current.setPositionAsync(0);
        setVideoState({ isPlaying: false, progress: 0 });
      }
    } catch (error) {
      console.error('Error stopping video:', error);
    }
  };

  const handleVideoPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      const progress = (status.positionMillis / status.durationMillis) * 100;
      setVideoState((prevState) => ({ ...prevState, progress }));
      if (status.didJustFinish) {
        setVideoState({ isPlaying: false, progress: 0 });
      }
    }
  };

  const renderImage = (imageUrl, index) => (
    <Image key={index} source={{ uri: imageUrl }} style={styles.image} />
  );

  const renderAudio = (audioUrl, index) => (
    <View key={index} style={styles.audioContainer}>
      <TouchableOpacity onPress={soundState.isPlaying ? stopAudio : () => playAudio(audioUrl)}>
        <Ionicons name={soundState.isPlaying ? 'stop-circle-outline' : 'play-circle-outline'} size={50} color="#fff" />
      </TouchableOpacity>
      <View style={styles.progressOverlay}>
        <View style={[styles.progressBar, { width: `${soundState.progress}%` }]} />
      </View>
    </View>
  );

  const renderVideo = (videoUrl, index) => (
    <View key={index} style={styles.imageContainer}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.image}
        resizeMode="contain"
        shouldPlay={true}
        isLooping={false}
        onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
      />
      <View style={styles.audioContainer}>
        <TouchableOpacity onPress={videoState.isPlaying ? stopVideo : playVideo}>
          <Ionicons name={videoState.isPlaying ? 'stop-circle-outline' : 'play-circle-outline'} size={50} color="#fff" />
        </TouchableOpacity>
        <View style={styles.progressOverlay}>
          <View style={[styles.progressBar, { width: `${videoState.progress}%` }]} />
        </View>
      </View>
    </View>
  );

  const renderContentByType = () => {
    if (!fileRecordsList || !Array.isArray(fileRecordsList)) {
      return (
        <View>
          <Text>Error: No media available</Text>
        </View>
      );
    }

    switch (mediaType) {
      case 'image_and_audio': {
        return (
          <View style={styles.imageContainer}>
            {fileRecordsList.map((file, index) => {
              if (file.type === 'image') {
                return renderImage(file.url, index);
              } else if (file.type === 'audio') {
                return renderAudio(file.url, index);
              }
            })}
          </View>
        );
      }
      case 'image':
        return (
          <View style={styles.imageContainer}>
            {fileRecordsList
            .filter((file) => file.type === 'image')
            .map((file, index) => renderImage(file.url, index))}
          </View>
        );
      case 'video': {
        return (
          <View>
            {fileRecordsList
              .filter((file) => file.type === 'video')
              .map((file, index) => renderVideo(file.url, index))}
          </View>
        );
      }
      default:
        return (
          <View>
            <Text>Error: Unsupported media type</Text>
          </View>
        );
    }
  };
  

  return <View>{renderContentByType()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#f0f0f0',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  audioContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  progressOverlay: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
});

export default MediaComponent;
