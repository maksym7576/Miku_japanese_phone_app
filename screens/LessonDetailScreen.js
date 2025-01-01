import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getMangaByIdSorted } from '../services/MangaService';
import { getExerciseData } from '../services/ExerciseService';
import lessonBackground from '../assets/background/lesson_background.png';   

const { width, height } = Dimensions.get('window');

const FloatingWordsBox = ({ words }) => {
  const [activeWords, setActiveWords] = useState([]);
  // Initialize animations ref with proper structure
  const animations = useRef({}).current;
  const wordsLimit = 3;

  // Initialize animations for new words
  useEffect(() => {
    words.forEach((_, index) => {
      if (!animations[index]) {
        animations[index] = {
          position: new Animated.ValueXY(),
          opacity: new Animated.Value(0)
        };
      }
    });
  }, [words]);

  const getRandomPosition = () => ({
    x: Math.random() * (width * 0.6),
    y: Math.random() * 150
  });

  const animateWord = (index) => {
    if (!animations[index]) return;
    
    const position = getRandomPosition();
    animations[index].position.setValue(position);

    Animated.sequence([
      Animated.timing(animations[index].opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.delay(2000),
      Animated.timing(animations[index].opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const availableIndices = words
        .map((_, index) => index)
        .filter(index => !activeWords.includes(index));

      if (availableIndices.length && activeWords.length < wordsLimit) {
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        setActiveWords(prev => [...prev, randomIndex]);
        animateWord(randomIndex);

        setTimeout(() => {
          setActiveWords(prev => prev.filter(i => i !== randomIndex));
        }, 3000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWords, words]);

  return (
    <View style={styles.floatingWordsContainer}>
      {words.map((word, index) => (
        animations[index] && (
          <Animated.Text
            key={index}
            style={[
              styles.floatingWord,
              {
                opacity: animations[index].opacity,
                transform: animations[index].position.getTranslateTransform()
              }
            ]}
          >
            {word}
          </Animated.Text>
        )
      ))}
    </View>
  );
};

const ExerciseBox = ({ exercise, onPress }) => (
  <TouchableOpacity 
    style={[styles.exerciseBox, exercise.completed && styles.exerciseBoxCompleted]} 
    onPress={onPress}
  >
    <Text style={styles.exerciseText} numberOfLines={2}>{exercise.name}</Text>
    <View style={styles.completionIndicator}>
      <View style={[
        styles.completionDot,
        exercise.completed && styles.completionDotActive
      ]} />
    </View>
  </TouchableOpacity>
);

const ExerciseTypeSection = ({ typeGroup, onExercisePress }) => (
  <View style={styles.exerciseTypeSection}>
    <Text style={styles.exerciseTypeTitle}>{typeGroup.type}</Text>
    <View style={styles.exercisesGrid}>
      {typeGroup.exerciseList.map((exercise) => (
        <ExerciseBox
          key={exercise.id}
          exercise={exercise}
          onPress={() => onExercisePress(exercise, typeGroup.type)}
        />
      ))}
    </View>
  </View>
);

const LessonDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { lessonId } = route.params || {};

  const [lessonData, setLessonData] = useState(null);
  const [isGrammarVisible, setIsGrammarVisible] = useState(false);
  const [currentExplanationIndex, setCurrentExplanationIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      const userId = 2;
      const response = await fetch(
        `http://10.0.2.2:8080/api/exercise/get/${lessonId}/user/${userId}`
      );
      const data = await response.json();
      setLessonData(data);
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    }
  };

  const handleExercisePress = async (exercise, type) => {
    try {
      if (type === 'MANGA') {
        const mangaData = await getMangaByIdSorted(lessonId);
        navigation.navigate('manga', { mangaData });
      } else if (type === 'EXERCISE') {
        const exerciseData = await getExerciseData(lessonId);
        navigation.navigate('exercise', { exerciseData });
      } else {
        console.log('Video pressed');
      }
    } catch (error) {
      console.error(`Error handling press for ${type}:`, error);
    }
  };

  const renderExerciseSection = ({ item: typeGroup, index }) => (
    <View style={styles.sectionWrapper}>
      <ExerciseTypeSection
        typeGroup={typeGroup}
        onExercisePress={handleExercisePress}
      />
      {index < (lessonData?.exercisesListWithType.length - 1) && (
        <View style={styles.verticalSeparator} />
      )}
    </View>
  );

  const renderGrammarItem = ({ item: explanation }) => (
    <ScrollView>
      <View style={styles.grammarPage}>
        <Text style={styles.title}>{explanation.guidance?.topic}</Text>
        <Text style={styles.description}>
          {explanation.guidance?.description}
        </Text>
        {explanation.tableDTOList.map((tableItem, index) => (
          <View key={index} style={styles.tableItemContainer}>
            <Text style={styles.tableItemName}>
              {tableItem.dynamicRow?.tableName || 'No name'}
            </Text>
            {tableItem.type === 'VOCABULARY' ? (
              <View style={styles.table}>
                {tableItem.textList.map((word, wordIndex) => (
                  <View key={wordIndex} style={styles.row}>
                    <Text style={styles.cell}>{word.kanji_word}</Text>
                    <Text style={styles.cell}>{word.hiragana_or_katakana}</Text>
                    <Text style={styles.cell}>{word.romanji_word}</Text>
                    <Text style={styles.cell}>{word.translation}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                {tableItem.textList.map((tableWord, wordIndex) => (
                  <View key={wordIndex} style={styles.containerPhrase}>
                    <View style={styles.phraseContainer}>
                      <Text style={styles.textKanji}>{tableWord.kanji_word}</Text>
                      <Text style={styles.textHiragana}>
                        {tableWord.hiragana_or_katakana}{' -> '}{tableWord.translation}
                      </Text>
                      <View style={styles.translationContainer}>
                        <Text style={styles.textRomanji}>{tableWord.romanji_word}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <ImageBackground source={lessonBackground} style={styles.container}>
      <TouchableOpacity
        style={styles.grammarButton}
        onPress={() => setIsGrammarVisible(true)}
      >
        <Text style={styles.buttonText}>Grammar</Text>
      </TouchableOpacity>

      <View style={styles.centralBoxContainer}>
        <FloatingWordsBox words={lessonData?.explainList || []} />
      </View>

      <View style={styles.bottomSection}>
        <FlatList
          data={lessonData?.exercisesListWithType || []}
          renderItem={renderExerciseSection}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exerciseList}
        />
      </View>

      <Modal
        visible={isGrammarVisible}
        animationType="slide"
        onRequestClose={() => setIsGrammarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsGrammarVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <FlatList
            ref={flatListRef}
            data={lessonData?.explanationList || []}
            renderItem={renderGrammarItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentExplanationIndex(index);
            }}
          />
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  grammarButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centralBoxContainer: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.15,
    width: width * 0.7,
    height: 150,
    backgroundColor: 'transparent', // Зробити фон прозорим
    borderRadius: 15,
    overflow: 'visible',
    // Видалити тіні та ефект підняття
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  floatingWordsContainer: {
    flex: 1,
    position: 'relative',
  },
  floatingWord: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 280,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  sectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  exerciseTypeSection: {
    width: width * 0.8,
    padding: 15,
  },
  exerciseTypeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12, // рівномірний відступ між завданнями
  },
  exerciseBox: {
    width: '45%',
    aspectRatio: 1.5,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    overflow: 'hidden', // текст не виходить за межі
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    padding: 16, // Increase padding to make the button larger
    marginVertical: 8,
  },
  exerciseBoxCompleted: {
    backgroundColor: '#2ECC71',
  },
  exerciseText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center', // текст вирівнюється по центру
    flexShrink: 1, // уникнення переносу
  },
  completionIndicator: {
    alignItems: 'flex-end',
  },
  completionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  completionDotActive: {
    backgroundColor: '#fff',
  },
  verticalSeparator: {
    width: 3,
    height: '60%',
    backgroundColor: '#ffffff',
    marginVertical: 0, // мінімальний відступ між типами
  },
  exerciseList: {
    paddingVertical: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 15,
    alignItems: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  grammarPage: {
    width: width,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495E',
  },
  tableItemContainer: {
    marginVertical: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  tableItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  cell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    color: '#34495E',
  },
});

export default LessonDetailScreen;