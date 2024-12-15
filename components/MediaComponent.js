import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Audio, Video } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';

class MediaComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sound: null,
      isPlaying: false,
      progress: 0,
      hasPlayed: false,
      videoProgress: 0,
      isVideoPlaying: false,
    };
    this.videoRef = React.createRef(); // useRef для відео
  }

  playAudio = async (audioUrl) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            if (status.isPlaying) {
              const progress = (status.positionMillis / status.durationMillis) * 100;
              this.setState({ progress });
            } else if (status.didJustFinish) {
              this.setState({ progress: 100, isPlaying: false });
              setTimeout(() => {
                this.setState({ progress: 0 });
              }, 500);
            }
          }
        }
      );
      this.setState({ sound, isPlaying: true });
    } catch (error) {
      console.error('Error playing audio', error);
    }
  };

  stopAudio = async () => {
    const { sound } = this.state;
    if (sound) {
      await sound.stopAsync();
      this.setState({ isPlaying: false, progress: 0 });
    }
  };

  playVideo = async () => {
    try {
      const { fileRecordsList } = this.props;
      const videoFile = fileRecordsList.find((file) => file.type === 'video');
      if (videoFile && this.videoRef.current) {
        this.setState({ videoProgress: 0, isVideoPlaying: true });
        await this.videoRef.current.stopAsync(); // Stop any current video playback
        await this.videoRef.current.setPositionAsync(0); // Reset to the start
        await this.videoRef.current.playAsync(); // Start playing the video
      }
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };

  stopVideo = async () => {
    try {
      if (this.videoRef.current) {
        await this.videoRef.current.pauseAsync(); // Pause the video
        await this.videoRef.current.setPositionAsync(0); // Reset to the start
        this.setState({ isVideoPlaying: false, videoProgress: 0 });
      }
    } catch (error) {
      console.error('Error stopping video:', error);
    }
  };

  handleVideoPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      const progress = (status.positionMillis / status.durationMillis) * 100;
      this.setState({ videoProgress: progress });
      if (status.didJustFinish) {
        this.setState({ isVideoPlaying: false, videoProgress: 0 });
      }
    }
  };

  renderImage = (imageUrl, index) => (
    <Image key={index} source={{ uri: imageUrl }} style={styles.image} />
  );

  renderAudio = (audioUrl, index) => (
    <View key={index} style={styles.audioContainer}>
      <TouchableOpacity onPress={this.state.isPlaying ? this.stopAudio : () => this.playAudio(audioUrl)}>
        <Ionicons name={this.state.isPlaying ? 'stop-circle-outline' : 'play-circle-outline'} size={50} color="#fff" />
      </TouchableOpacity>
      <View style={styles.progressOverlay}>
        <View style={[styles.progressBar, { width: `${this.state.progress}%` }]} />
      </View>
    </View>
  );

  renderVideo = (videoUrl, index) => (
    <View key={index} style={styles.imageContainer}>
      <Video
        ref={this.videoRef}
        source={{ uri: videoUrl }}
        style={styles.image}
        resizeMode="contain"
        shouldPlay={true}
        isLooping={false}
        onPlaybackStatusUpdate={this.handleVideoPlaybackStatusUpdate}
      />
      <View style={styles.audioContainer}>
        <TouchableOpacity onPress={this.state.isVideoPlaying ? this.stopVideo : this.playVideo}>
          <Ionicons name={this.state.isVideoPlaying ? 'stop-circle-outline' : 'play-circle-outline'} size={50} color="#fff" />
        </TouchableOpacity>
        <View style={styles.progressOverlay}>
          <View style={[styles.progressBar, { width: `${this.state.videoProgress}%` }]} />
        </View>
      </View>
    </View>
  );

  renderContentByType = () => {
    const { mediaType, fileRecordsList } = this.props;
    if (!fileRecordsList || !Array.isArray(fileRecordsList)) {
      return (
        <View>
          <Text>Error: No media available</Text>
        </View>
      );
    }

    switch (mediaType) {
      case 'image_and_audio':
        return (
          <View style={styles.imageContainer}>
            {fileRecordsList.map((file, index) => {
              if (file.type === 'image') {
                return this.renderImage(file.url, index);
              } else if (file.type === 'audio') {
                return this.renderAudio(file.url, index);
              }
            })}
          </View>
        );
      case 'image':
        return (
          <View style={styles.imageContainer}>
            {fileRecordsList.filter((file) => file.type === 'image').map((file, index) => this.renderImage(file.url, index))}
          </View>
        );
      case 'video':
        return (
          <View>
            {fileRecordsList
              .filter((file) => file.type === 'video')
              .map((file, index) => this.renderVideo(file.url, index))}
          </View>
        );
      default:
        return (
          <View>
            <Text>Error: Unsupported media type</Text>
          </View>
        );
    }
  };

  render() {
    return <View>{this.renderContentByType()}</View>;
  }
}

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
