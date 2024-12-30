import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform, 
  ImageBackground
} from 'react-native';
import { getAllLevelsWithLessonsWithUserId } from '../services/LevelServicce';
import lessonBackground from '../assets/background/lesson_background.png';


const LessonsList = ({ navigation }) => {
  const [levels, setLevels] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGuidance, setSelectedGuidance] = useState([]);

  React.useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await getAllLevelsWithLessonsWithUserId();
        setLevels(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLevels();
  }, []);

  const openGuidanceModal = (guidanceList) => {
    setSelectedGuidance(guidanceList);
    setModalVisible(true);
  };

  const GuidanceModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.modalScroll}>
            {selectedGuidance.map((item) => (
              <Text 
                key={item.id} 
                style={[
                  styles.guidanceText,
                  item.type === 'USER_UNDERSTANDING' && styles.understandingText,
                  item.isCompleted && styles.completedText,
                ]}
              >
                {item.text}
              </Text>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderLesson = (lesson, isLastLesson) => (
    <View style={styles.lessonContainer} key={lesson.id}>
      <TouchableOpacity
        style={[
          styles.circle,
          lesson.isFinished ? styles.completedCircle : styles.incompleteCircle, // умовне застосування стилю
        ]}
        onPress={() => navigation.navigate('LessonDetailScreen', { lessonId: lesson.id })}
      >
        <Text style={styles.lessonTitle}>Lesson {lesson.position}</Text>
      </TouchableOpacity>
      {!isLastLesson && <View style={styles.verticalLine} />}
    </View>
  );
  

  const renderBlock = (block) => (
    <View style={styles.blockContainer} key={block.id}>
      <Text style={styles.blockTitle}>{block.topic}</Text>
      <View style={styles.blockContent}>
        {block.lessonList.map((lesson, index) =>
          renderLesson(lesson, index === block.lessonList.length - 1)
        )}
      </View>
    </View>
  );

  const renderLevel = ({ item }) => (
    <View style={styles.levelContainer}>
      <Text style={styles.levelTitle}>Level {item.level}</Text>
      
      {item.levelGuidanceList.length > 0 && (
        <View style={styles.lessonContainer}>
          <TouchableOpacity
            style={[styles.circle, styles.infoCircle]}
            onPress={() => openGuidanceModal(item.levelGuidanceList)}
          >
            <Text style={styles.lessonTitle}>Info</Text>
          </TouchableOpacity>
          {/* <View style={styles.verticalLine} /> */}
        </View>
      )}
      
      {item.blockList.map(block => renderBlock(block))}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }



  return (
    <ImageBackground
    source={lessonBackground}
    style={styles.backgroundImage}
  >
    <SafeAreaView style={styles.container}>
      <FlatList
        data={levels}
        renderItem={renderLevel}
        keyExtractor={level => level.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <GuidanceModal />
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Або 'contain' залежно від бажаного результату
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(248, 249, 250, 0.8)', // Напівпрозорий фон для кращої читабельності
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 40,
  },
  levelContainer: {
    marginBottom: 32,
  },
  levelTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 24,
    color: '#2C3E50', // Темно-сірий з синім відтінком
    letterSpacing: 0.5,
  },
  blockContainer: {
    marginBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E3E3E3',
    paddingTop: 20,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E', // Темно-сірий
    marginBottom: 20,
    paddingHorizontal: 16,
    textAlign: 'left', // Змінено на left для більш органічного вигляду
    letterSpacing: 0.3,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    borderLeftWidth: 4, // Додано лівий бордер
    borderLeftColor: '#3498DB', // Синій акцент
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  blockContent: {
    alignItems: 'center',
  },
  lessonContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  completedCircle: {
    borderColor: '#27AE60', // Зелений
    backgroundColor: '#F0FAF5', // Світло-зелений
  },
  incompleteCircle: {
    borderColor: '#95A5A6', // Сірий
    backgroundColor: '#FAFAFA',
  },
  infoCircle: {
    backgroundColor: '#EBF5FB', // Світло-синій
    borderColor: '#3498DB', // Синій
  },
  verticalLine: {
    width: 3,
    height: 24,
    backgroundColor: '#BDC3C7',
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50', // Темно-сірий з синім відтінком
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalScroll: {
    maxHeight: '90%',
  },
  guidanceText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
    color: '#34495E',
    letterSpacing: 0.3,
  },
  understandingText: {
    fontWeight: '600',
    textAlign: 'center',
    color: '#2C3E50',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#95A5A6',
  },
  closeButton: {
    marginTop: 24,
    padding: 14,
    backgroundColor: '#3498DB', // Синій
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});


export default LessonsList;
