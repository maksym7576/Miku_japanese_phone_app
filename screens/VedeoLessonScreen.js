import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Video } from 'expo-av';

class VideoLessonScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,             // Поточний час відео
      activeSubtitleIndex: null,  // Індекс активного субтитру
    };
    this.videoRef = React.createRef();
  }

  handleTimeUpdate = (status) => {
    if (status.isPlaying) {
      // Оновлюємо поточний час (в секундах)
      this.setState({ currentTime: status.positionMillis / 1000 }, this.updateActiveSubtitle);
    }
  };

  updateActiveSubtitle = () => {
    const { videoData } = this.props.route.params;
    const { currentTime } = this.state;
    // Знаходимо індекс субтитру, який відповідає поточному часу
    const activeSubtitleIndex = videoData.subtitleList.findIndex(
      (subtitle) => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
    );
    
    this.setState({ activeSubtitleIndex });
  };

  render() {
    const { videoData } = this.props.route.params;  // Отримуємо videoData з параметрів навігації
    const { activeSubtitleIndex } = this.state;

    return (
        <ScrollView>
      <View style={styles.container}>
        {videoData ? (
          <>
            <Video
              ref={this.videoRef}
              source={{ uri: videoData.fileRecords.url }}  // Використовуємо URL з videoData
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              isLooping
              onPlaybackStatusUpdate={this.handleTimeUpdate}
            />
            <Text style={styles.subtitles}>
              {videoData.subtitleList.map((subtitle, index) => (
                <Text
                  key={subtitle.id}
                  style={[
                    styles.subtitle,
                    activeSubtitleIndex === index && styles.activeSubtitle,
                  ]}
                >
                  {subtitle.text}{" "}
                </Text>
              ))}
            </Text>
          </>
        ) : (
          <Text style={styles.noDataText}>No video data available</Text>
        )}
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, // Відступи з боків
    paddingTop: 50,        // Відступ зверху
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 28,          // Збільшений розмір заголовку
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',     // Вирівнювання по лівому краю
    width: '100%',
  },
  video: {
    width: '100%',
    height: 250,           // Висота відео
    marginBottom: 20,
  },
  subtitles: {
    fontSize: 22,          // Збільшений розмір тексту субтитрів
    textAlign: 'left',     // Текст вирівнюється по лівому краю
    width: '100%',
  },
  subtitle: {
    fontSize: 22,
    color: '#333',
  },
  activeSubtitle: {
    color: 'red',         // Підсвічування активного субтитру
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 22,
    textAlign: 'center',
  },
});

export default VideoLessonScreen;
