import ScreenSection from '@components/containers/ScreenSection';
import Button from '@components/ui/Button';
import ErrorMessage from '@components/ui/ErrorMessage';
import TextInput from '@components/ui/TextInput';
import { User } from '@models/user/User';
import { ModalService } from '@services/modalService';
import { fontStyles } from '@styles';
import { useRef, useState } from 'react';
import { Text } from 'react-native';

export default function LoginSection({ login, goToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const timerRef = useRef(null);

    const validateEmail = () => {
        clearTimeout(timerRef.current);
        setEmailError(null);
    }

    const handleEmailChange = (value) => {
        clearTimeout(timerRef.current);
        setEmailError(null);

        try {
            User.validateEmail(value);
        } catch (error) {
            timerRef.current = setTimeout(() => {
                setEmailError(error.message);
            }, 1000);
        }

        setEmail(value);
    };

    const handlePasswordChange = (value) => {
        try {
            User.validatePassword(value);
            setPasswordError(null);
        } catch (error) {
            setPasswordError(error.message);
        } finally {
            setPassword(value);
        }
    }

    const handleLogin = async () => {
        try {
            await login(email, password);
        } catch (error) {
            ModalService.showError('Nie mogłem Cię zalogować. Sprawdź wprowadzone dane i spróbuj jeszcze raz.');
        }
    }

    const isValid = email && password && !emailError && !passwordError;

    return (
        <ScreenSection
            title={"Logowanie"}>
            <Text style={{ ...fontStyles.regular, marginBottom: 50 }}>
                {'Wprowadź dane konta lub skorzystaj z innej dostępnej metody logowania.'}
            </Text>

            <TextInput label="E-mail"
                value={email}
                onChange={handleEmailChange}
                returnKeyType={'next'}
                error={emailError}
                onBlur={validateEmail}

            />
            <ErrorMessage>{emailError}</ErrorMessage>

            <TextInput label="Hasło"
                value={password}
                onChange={handlePasswordChange}
                secureTextEntry={true}
                error={passwordError}
            />
            <ErrorMessage>{passwordError}</ErrorMessage>

            <Button
                title={"Zaloguj się"}
                onPress={handleLogin}
                disabled={!isValid}
                style={{ alignSelf: 'center' }}
            />
        </ScreenSection>
    );
}
