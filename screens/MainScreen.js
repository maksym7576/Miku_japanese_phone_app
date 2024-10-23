import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/styles';

const MainScreen = ({ route }) => {
  const { username } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
    </View>
  );
};

export default MainScreen;