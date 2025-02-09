import AsyncStorage from "@react-native-async-storage/async-storage";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import { Platform } from "react-native";
import { app } from "src/configs/firebaseConfig";

export const auth = initializeAuth(app, {
    persistence: Platform.OS === 'web'
        ? browserLocalPersistence
        : getReactNativePersistence(AsyncStorage),
});

export function isAuth() {
    return !!auth.currentUser;
}

export function getCurrentUid() {
    const uid = auth?.currentUser?.uid;
    if (!uid) {
        throw new Error('User is not authenticated or uid is not set.');
    }
    return uid;
}
