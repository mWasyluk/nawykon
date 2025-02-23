import {
    Genos_400Regular,
    Genos_500Medium,
    Genos_600SemiBold,
    Genos_600SemiBold_Italic,
    Genos_700Bold
} from '@expo-google-fonts/genos';
import { ModalService } from '@services/modalService';
import { useFonts } from "expo-font";
import { createContext, useContext, useEffect } from "react";

const FontsContext = createContext({ isLoading: true });

export function FontsProvider({ children }) {
    const [loaded, error] = useFonts({
        Genos_400Regular,
        Genos_500Medium,
        Genos_600SemiBold,
        Genos_600SemiBold_Italic,
        Genos_700Bold
    });


    useEffect(() => {
        if (error) {
            ModalService.showError('Nie udało mi się pobrać czcionek. Odśwież aplikację, żebym mógł spróbować jeszcze raz.');
        }
    }, [error]);

    return (
        <FontsContext.Provider value={{ isLoading: !loaded }}>
            {children}
        </FontsContext.Provider>
    );
}

const customUseFonts = () => useContext(FontsContext);
export { customUseFonts as useFonts };
