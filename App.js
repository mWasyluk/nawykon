import { ExpoRoot } from 'expo-router';
import { Text } from 'react-native';
import { useStateManager } from 'src/context/StateManagerContext';
import { useUser } from 'src/context/UserContext';

const ctx = require.context("./src/screens");

export default function App() {
    const { user } = useUser();
    const { loading, error } = useStateManager();

    const message = loading || error;

    if (message) {
        return <Text>{message}</Text>;
    }

    return <ExpoRoot context={ctx} />;
};
