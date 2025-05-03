import AsyncStorage from '@react-native-async-storage/async-storage';

const keyPrefix = 'nawykon_storage_';
const sanitizeKey = (key) => `${keyPrefix}${key}`;

const StorageService = {
    setItem: async (key, data) => {
        const value = JSON.stringify(data);
        await AsyncStorage.setItem(sanitizeKey(key), value);
    },

    getItem: async (key) => {
        const value = await AsyncStorage.getItem(sanitizeKey(key));
        return value ? JSON.parse(value) : null;
    },

    getAllKeys: async (prefix = '') => {
        return (await AsyncStorage.getAllKeys())
            .filter((key) => key.startsWith(`${keyPrefix}${prefix}`))
            .map((key) => key.replace(keyPrefix, ''));
    },

    removeItem: async (key) => {
        await AsyncStorage.removeItem(sanitizeKey(key));
    },

    clear: async () => {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
    },
};

export default StorageService;
