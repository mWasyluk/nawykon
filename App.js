import ProvidersWrapper from '@contexts/ProvidersWrapper';
import { colors } from '@styles';
import { DebuggerMenu } from 'development/DebuggerMenu';
import { ExpoRoot } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';

const ctx = require.context("./src/screens");

export default function App() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.light }}>
            <RootSiblingParent>
                <ProvidersWrapper>
                    <ExpoRoot context={ctx} />
                    <DebuggerMenu />
                </ProvidersWrapper>
            </RootSiblingParent>
        </SafeAreaView>
    )
};
