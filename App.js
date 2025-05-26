import ProvidersWrapper from '@contexts/ProvidersWrapper';
import { ScreenManager } from '@screens/commons/ScreenManager';
import { colors } from '@styles';
import { DebuggerMenu } from 'development/DebuggerMenu';
import { ExpoRoot } from 'expo-router';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ctx = require.context("./src/screens");

export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.light }}>
                <RootSiblingParent>
                    <ProvidersWrapper>
                        <ScreenManager>
                            <ExpoRoot context={ctx} />
                            <DebuggerMenu />
                        </ScreenManager>
                    </ProvidersWrapper>
                </RootSiblingParent>
            </SafeAreaView>
        </SafeAreaProvider>
    )
};
