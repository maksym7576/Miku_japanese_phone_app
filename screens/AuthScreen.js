import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import styles from '../styles/auth';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <View style={styles.container}>
      {isLogin ? (
        <LoginForm navigation={navigation} />
      ) : (
        <RegisterForm navigation={navigation} />
      )}
      <TouchableOpacity onPress={toggleForm} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isLogin ? "Registration" : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;