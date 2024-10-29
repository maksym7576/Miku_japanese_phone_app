import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Button } from 'react-native';
import styles from '../styles/auth';
import { loginUser } from '../services/authService';
import { useNavigation } from '@react-navigation/native';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await loginUser(username, password);
      navigation.navigate('Lessons')
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginForm;