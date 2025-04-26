import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '@configs/firebaseConfig';

const sanitizeKey = (key) => `${app.name}_${key}`;

const StoreService = {
    async setItem(key, data, secured = false) {
        // Serialize data
        const value = JSON.stringify(data);

        if (Platform.OS === 'web') {
            // WEB -> localStorage
            localStorage.setItem(sanitizeKey(key), value);
        } else {
            // MOBILE
            if (secured) {
                await SecureStore.setItemAsync(sanitizeKey(key), value);
            } else {
                await AsyncStorage.setItem(sanitizeKey(key), value);
            }
        }
    },

    async getItem(key, secured = false) {
        let value = null;

        if (Platform.OS === 'web') {
            // WEB -> localStorage
            value = localStorage.getItem(sanitizeKey(key));
        } else {
            // MOBILE
            value = secured
                ? await SecureStore.getItemAsync(sanitizeKey(key))
                : await AsyncStorage.getItem(sanitizeKey(key));
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

    async removeItem(key, secured = false) {
        if (Platform.OS === 'web') {
            localStorage.removeItem(sanitizeKey(key));
        } else {
            if (secured) {
                await SecureStore.deleteItemAsync(sanitizeKey(key));
            } else {
                await AsyncStorage.removeItem(sanitizeKey(key));
            }
        }
    }
};

export default StoreService;
