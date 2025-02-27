import ProvidersWrapper from '@contexts/ProvidersWrapper';
import { ExpoRoot } from 'expo-router';
import { RootSiblingParent } from 'react-native-root-siblings';

const ctx = require.context("./src/screens");

export default function App() {
    return (
        <RootSiblingParent>
            <ProvidersWrapper>
                <ExpoRoot context={ctx} />
            </ProvidersWrapper>
        </RootSiblingParent>
    )
};
