import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import styles from '../styles/auth';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage(''); 
  };

  const handleError = (message) => {
    setErrorMessage(message);
  };

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      {isLogin ? (
        <LoginForm navigation={navigation} handleError={handleError} />
      ) : (
        <RegisterForm navigation={navigation} handleError={handleError} />
      )}
      <TouchableOpacity onPress={toggleForm} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isLogin ? "Register" : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;
