import { TitleText } from "@components/text";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

/**
 * Minimalny przykład sekcji rejestracji.
 * onGoToLogin() – wzywamy, gdy użytkownik kliknie „Mam już konto” i chce wrócić do logowania.
 * onRegistered() – wzywamy, gdy rejestracja przebiegnie pomyślnie (StateManagerContext obsłuży animację i ModalService).
 */
export default function RegisterSection(props) {
    const { onGoToLogin, onRegistered } = props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // TO-DO: Podłącz do swojego serwisu/ UserContext, np. auth.createUserWithEmailAndPassword
    const handleRegister = async () => {
        setIsLoading(true);
        try {
            // Przykład (zależnie od Twojego serwisu):
            // await signUp(email, password);
            // Wywołaj callback
            onRegistered && onRegistered();
        } catch (err) {
            // Obsłuż błąd
            console.error(err);
        }
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            <TitleText style={styles.title}>Rejestracja</TitleText>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Hasło"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button
                title="Zarejestruj się"
                onPress={handleRegister}
                disabled={isLoading}
            />
            <Button title="Mam już konto" onPress={onGoToLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        alignItems: "center",
    },
    title: {
        marginBottom: 16,
    },
    input: {
        width: "80%",
        height: 40,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
    },
});
