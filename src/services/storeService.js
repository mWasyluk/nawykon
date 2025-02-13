import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeService = {
    async setItem(key, data, secured = true) {
        // Serialize data
        const value = JSON.stringify(data);

        if (Platform.OS === 'web') {
            // WEB -> localStorage
            localStorage.setItem(key, value);
        } else {
            // MOBILE
            if (secured) {
                await SecureStore.setItemAsync(key, value);
            } else {
                await AsyncStorage.setItem(key, value);
            }
        }
    },

    async getItem(key, secured = true) {
        let value = null;

        if (Platform.OS === 'web') {
            // WEB -> localStorage
            value = localStorage.getItem(key);
        } else {
            // MOBILE
            value = secured
                ? await SecureStore.getItemAsync(key)
                : await AsyncStorage.getItem(key);
        }

        if (!value) return null;

        // Serialize if string
        try {
            return JSON.parse(value);
        } catch (err) {
            // If not a string, return as is
            return value;
        }
    },

    async removeItem(key, secured = true) {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            if (secured) {
                await SecureStore.deleteItemAsync(key);
            } else {
                await AsyncStorage.removeItem(key);
            }
        }
    }
};
