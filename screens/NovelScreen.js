import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Audio } from 'expo-av';

class NovelScreen extends Component {
  constructor(props) {
    super(props);
    const { novelData } = props.route.params;
    this.state = {
      // Головний список діалогів із JSON
      contentList: novelData.dialogueList || [],
      currentIndex: 0,
      // Збереження URL зображення. Якщо нове не задане – зображення залишається попереднім.
      currentImage: null,
      // Об'єкт аудіо (якщо є)
      currentAudio: null,
      // Поля для роботи з питаннями та їх «гілками»
      isQuestionAnswered: false,
      branchContent: [],
      branchIndex: 0,
    };
  }

  componentDidMount() {
    const { contentList, currentIndex } = this.state;
    if (contentList[currentIndex]) {
      this.updateMedia(contentList[currentIndex]);
    }
  }

  componentWillUnmount() {
    if (this.state.currentAudio) {
      this.state.currentAudio.unloadAsync();
    }
  }

  // Завантаження та відтворення аудіо за допомогою expo-av
  async playAudio(url) {
    try {
      if (this.state.currentAudio) {
        await this.state.currentAudio.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      this.setState({ currentAudio: sound });
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  // Функція оновлення медіа: якщо в записі є mediaPackage – перевіряємо кожен файл
  updateMedia(item) {
    if (item.content && item.content.mediaPackage && item.content.mediaPackage.fileRecordsList) {
      const fileRecords = item.content.mediaPackage.fileRecordsList;
      fileRecords.forEach(file => {
        if (file.type === 'image') {
          // Якщо зображення задане – оновлюємо currentImage
          this.setState({ currentImage: file.url });
        }
        if (file.type === 'audio') {
          // Якщо аудіо задане – відтворюємо його
          this.playAudio(file.url);
        }
      });
    }
  }

  // Обробка переходу (натискання по екрану)
  handleAdvance = () => {
    const { isQuestionAnswered, branchContent, branchIndex, contentList, currentIndex } = this.state;
    // Якщо зараз показується гілка (після відповіді на питання)
    if (isQuestionAnswered && branchContent.length > 0) {
      if (branchIndex < branchContent.length - 1) {
        this.setState({ branchIndex: branchIndex + 1 });
        return;
      } else {
        // Гілка завершена – скидаємо прапорець і переходимо до наступного основного запису
        this.setState({ isQuestionAnswered: false, branchContent: [], branchIndex: 0 });
      }
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex < contentList.length) {
      this.setState({ currentIndex: nextIndex }, () => {
        this.updateMedia(contentList[nextIndex]);
      });
    } else {
      // Якщо записи закінчилися, можна відобразити повідомлення "Кінець новели"
      this.setState({ currentIndex: nextIndex });
    }
  };

  // Обробка вибору відповіді для типу "question"
  handleAnswerSelection = (answer) => {
    const currentItem = this.state.contentList[this.state.currentIndex];
    const isCorrect = answer.correct;
    const branchContent = isCorrect
      ? currentItem.content.phrasesTrueLine || []
      : currentItem.content.phrasesFalseLine || [];
    if (branchContent.length > 0) {
      this.setState({
        isQuestionAnswered: true,
        branchContent,
        branchIndex: 0,
      });
    } else {
      // Якщо немає гілки – переходимо до наступного запису
      this.handleAdvance();
    }
  };

  // Рендеринг основного діалогу або гілки (якщо питання вже відповіли)
  renderDialogue() {
    const { contentList, currentIndex, isQuestionAnswered, branchContent, branchIndex } = this.state;
    if (currentIndex >= contentList.length) {
      return (
        <View style={styles.endContainer}>
          <Text style={styles.endText}>Кінець новели</Text>
        </View>
      );
    }
    const currentItem = contentList[currentIndex];

    // Якщо ми в режимі гілки – показуємо відповідний рядок з неї
    if (isQuestionAnswered && branchContent.length > 0) {
      const branchItem = branchContent[branchIndex];
      return (
        <View style={styles.dialogueContainer}>
          <Text style={styles.dialogueText}>{branchItem.textDTO.romanji_word}</Text>
          <Text style={styles.translationText}>{branchItem.textDTO.translation}</Text>
        </View>
      );
    } else {
      // Для записів типу "phrase"
      if (currentItem.type === 'phrase') {
        if (currentItem.content && currentItem.content.object && currentItem.content.object.textDTO) {
          const textDTO = currentItem.content.object.textDTO;
          return (
            <View style={styles.dialogueContainer}>
              <Text style={styles.dialogueText}>{textDTO.romanji_word}</Text>
              <Text style={styles.translationText}>{textDTO.translation}</Text>
            </View>
          );
        }
      }
      // Для записів типу "question" – показуємо текст питання та варіанти відповідей
      else if (currentItem.type === 'question') {
        if (currentItem.content && currentItem.content.question && currentItem.content.question.question) {
          const questionObj = currentItem.content.question.question;
          const answers = currentItem.content.question.answer;
          return (
            <View style={styles.dialogueContainer}>
              <Text style={styles.questionText}>{questionObj.question}</Text>
              {answers.map((ans) => (
                <TouchableOpacity
                  key={ans.id}
                  style={styles.answerButton}
                  onPress={() => this.handleAnswerSelection(ans)}
                >
                  <Text style={styles.answerText}>{ans.romanji_word}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        }
      }
    }
    return null;
  }

  render() {
    const { currentImage, contentList, currentIndex } = this.state;
    const currentItem = contentList[currentIndex];
    // Якщо поточний запис – питання і відповідь ще не обрана, вимикаємо перехід по натисканню фону
    const disableAdvance = currentItem && currentItem.type === 'question' && !this.state.isQuestionAnswered;

    return (
      <View style={styles.container}>
        {/* Фонове зображення (залишається попереднім, якщо нове не задане) */}
        {currentImage && (
          <Image source={{ uri: currentImage }} style={styles.backgroundImage} resizeMode="cover" />
        )}
        <TouchableOpacity
          style={styles.overlay}
          onPress={!disableAdvance ? this.handleAdvance : null}
          activeOpacity={1}
        >
          {this.renderDialogue()}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  dialogueContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 8,
  },
  dialogueText: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 8,
  },
  translationText: {
    fontSize: 18,
    color: '#ddd',
  },
  questionText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 12,
  },
  answerButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  answerText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  endContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  endText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NovelScreen;
