import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { getUSerProfileByToken } from '../services/UserService';

const UserData = () => {
    const [userProfile, setUserProfile] = useState(null);

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
        </View>
    )
};

export default UserData;