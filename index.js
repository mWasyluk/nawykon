import "@expo/metro-runtime";
import App from './App.js';
import DataProviders from './src/context/DataProviders';
import { registerRootComponent } from 'expo';
import { ModalProvider } from "src/context/ModalContext.js";

const Root = () => (
    <DataProviders>
        <ModalProvider>
            <App />
        </ModalProvider>
    </DataProviders>
);

registerRootComponent(Root);
