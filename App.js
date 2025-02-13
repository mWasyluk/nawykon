import { ExpoRoot } from 'expo-router';
import ProvidersWrapper from 'src/context/ProvidersWrapper';

const ctx = require.context("./src/screens");

export default function App() {
    return (
        <ProvidersWrapper>
            <ExpoRoot context={ctx} />;
        </ProvidersWrapper>
    )
};
