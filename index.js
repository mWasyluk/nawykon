import "@expo/metro-runtime";
import App from './App.js';
import DataProviders from './src/context/DataProviders';
import { registerRootComponent } from 'expo';
import { ErrorProvider } from "src/context/ErrorContext.js";

const Root = () => (
    <DataProviders>
        <ErrorProvider>
            <App />
        </ErrorProvider>
    </DataProviders>
);

registerRootComponent(Root);
