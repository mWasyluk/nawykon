import { ExpoRoot } from 'expo-router';
import { RootSiblingParent } from 'react-native-root-siblings';
import ProvidersWrapper from 'src/context/ProvidersWrapper';

const ctx = require.context("./src/screens");

export default function App() {
    return (
        <RootSiblingParent>
            <ProvidersWrapper>
                <ExpoRoot context={ctx} />;
            </ProvidersWrapper>
        </RootSiblingParent>
    )
};
