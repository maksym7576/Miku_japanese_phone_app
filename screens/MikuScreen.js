import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getCharacterData } from '../services/characterService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNovelData } from '../services/ExerciseService';
import { useNavigation } from '@react-navigation/native';
const MikuScreen = () => {
const [ characterData, setCharacterData ] = useState({})
const [loading, setLoading] = useState(true);  
const [images, setImages] = useState({
  happy: null,
  neutral: null,
  sad: null,
});

const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
    try {
    const userDataJson = await AsyncStorage.getItem('userData');
    const userData = userDataJson ? JSON.parse(userDataJson) : {};
    console.log('User data:', userData);
    const response = await getCharacterData(userData.id);
    console.log('Character data:', response);
    setCharacterData(response);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  }, []);


  useEffect(() => {
    const loadImages = () => {
      setImages({
        happy: require('../assets/miku_moods/happy_miku.png'),
        neutral: require('../assets/miku_moods/a_little_sad_miku.png'),
        sad: require('../assets/miku_moods/sad_miku.png'),
      });
    };

    loadImages();
  }, []);


  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handlePress = async (id) => {
    try {
      const response = await getNovelData(id);
      console.log('Novel Data:', response);
      navigation.navigate('novel', { novelData: response });
    } catch (error) {
      console.log("Error:", error);
    }
  };
  

  const renderNovelItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)}>
    <View style={styles.novelCard}>
      <Text style={styles.novelName}>{item.name}</Text>
      <Text style={styles.novelStatus}>{item.completed ? 'Completed' : 'In Progress'}</Text>
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {characterData.character ? (
        <>
          <View style={styles.centerContent}>
            <View style={styles.outerImageContainer}>
              <View style={styles.imageContainer}>
                {characterData.character.characterMood > 60 ? (
                  <Image source={images.happy} style={styles.image} />
                ) : characterData.character.characterMood > 30 ? (
                  <Image source={images.neutral} style={styles.image} />
                ) : (
                  <Image source={images.sad} style={styles.image} />
                )}
              </View>
            </View>
            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>
                Level: {characterData.character.characterLevel}
              </Text>
            </View>
          </View>
          <View style={styles.flatListContainer}>
            <FlatList
              data={characterData.novelsList}
              renderItem={renderNovelItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </>
      ) : (
        <Text>No character data available</Text>
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 20, // відступ від самого низу, якщо потрібно
  },
  outerImageContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    paddingTop: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  levelContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '55%',
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  novelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  novelStatus: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  novelList: {
    marginTop: 20,
  },
  novelCard: {
    width: 150,
    height: 200,
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default MikuScreen;