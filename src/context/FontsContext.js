import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import {
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_600SemiBold,
    OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import { ModalService } from '@services/modalService';
import { useFonts } from "expo-font";
import { createContext, useContext, useEffect } from "react";

const FontsContext = createContext({ isLoading: true });

export function FontsProvider({ children }) {
    const [loaded, error] = useFonts({
        OpenSans_400Regular,
        OpenSans_400Regular_Italic,
        OpenSans_600SemiBold,
        OpenSans_700Bold,
        Montserrat_500Medium,
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
