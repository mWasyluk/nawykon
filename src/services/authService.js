import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import * as SecureStore from 'expo-secure-store';
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import { Platform } from "react-native";
import { app } from "src/configs/firebaseConfig";

class SecureStorageAdapter {
    #sanitizeKey = (key) => {
        return key.replace(/[^a-zA-Z0-9]/g, '_');
    };

    async getItem(key) {
        try {
            return await SecureStore.getItemAsync(this.#sanitizeKey(key));
        } catch {
            throw new Error("Nie mogłem pobrać danych z pamięci urządzenia.");
        }
    }
    async setItem(key, value) {
        try {
            await SecureStore.setItemAsync(this.#sanitizeKey(key), value);
        } catch {
            throw new Error("Nie mogłem zapisać danych w pamięci urządzenia.");
        }
    }
    async removeItem(key) {
        try {
            await SecureStore.deleteItemAsync(this.#sanitizeKey(key));
        } catch {
            throw new Error("Nie mogłem usunąć danych z pamięci urządzenia.");
        }
    }
}

const auth = initializeAuth(app, {
    persistence:
        Platform.OS === "web"
            ? browserLocalPersistence
            : getReactNativePersistence(new SecureStorageAdapter()),
});

export { auth };
