import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { app } from "src/configs/firebaseConfig";
import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';

class SecureStorageAdapter {
    #sanitizeKey(key) {
        return key.split(":")[2] || key;
    }
    async getItem(key) {
        return await SecureStore.getItemAsync(this.#sanitizeKey(key));
    }
    async setItem(key, value) {
        await SecureStore.setItemAsync(this.#sanitizeKey(key), value);
    }
    async removeItem(key) {
        await SecureStore.deleteItemAsync(this.#sanitizeKey(key));
    }
}

const auth = initializeAuth(app, {
    persistence:
        Platform.OS === "web"
            ? browserLocalPersistence
            : getReactNativePersistence(new SecureStorageAdapter()),
});

export { auth };
