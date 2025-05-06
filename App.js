import ProvidersWrapper from '@contexts/ProvidersWrapper';
import { colors } from '@styles';
import { DebuggerMenu } from 'development/DebuggerMenu';
import { ExpoRoot } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ctx = require.context("./src/screens");

export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.light }}>
                <RootSiblingParent>
                    <ProvidersWrapper>
                        <ExpoRoot context={ctx} />
                        <DebuggerMenu />
                    </ProvidersWrapper>
                </RootSiblingParent>
            </SafeAreaView>
        </SafeAreaProvider>
    )
};
