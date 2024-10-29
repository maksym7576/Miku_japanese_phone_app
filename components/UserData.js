import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { getUSerProfileByToken } from '../services/UserService';
import { Button } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserData = () => {
    const [userProfile, setUserProfile] = useState(null);
      const navigation = useNavigation();

    useEffect(() => {
        const getUserData = async () => {
            try {
                const profile = await getUSerProfileByToken();
                setUserProfile(profile);
            } catch (error) {
                console.error('Error getting user data:', error);
            }
        };
        getUserData();
    },[]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            navigation.navigate('logout')
        } catch(error) {
                console.error(error);
        }
    }

    return (
        <View>
            {userProfile ? (
                <>
            <Text>username: {userProfile.username}</Text>
            <Text>email: {userProfile.email}</Text>
            </>
        ) : (
            <Text>Loading...</Text>
        )}
        <Button title='Logout' onPress={handleLogout}/>
        </View>
    )
};

export default UserData;