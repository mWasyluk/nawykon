import "@expo/metro-runtime";
import { registerRootComponent } from 'expo';
import App from './App.js';
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

registerRootComponent(() => <App />);
