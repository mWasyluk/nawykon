import { ExpoRoot } from 'expo-router';
import { Text } from 'react-native';
import { useStateManager } from 'src/context/StateManagerContext';

const ctx = require.context("./src/screens");

export default function App() {
    const { loading, error } = useStateManager();

    const message = error || loading;

    if (message) {
        return <Text>{message}</Text>;
    }

    return <ExpoRoot context={ctx} />;
};
