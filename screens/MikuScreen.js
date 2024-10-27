import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const MikuScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://example.com/temple-image.jpg' }} // Replace with actual temple image
        style={styles.image}
      />
      <Text style={styles.text}>Miku Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 20,
  }
});

export default MikuScreen;