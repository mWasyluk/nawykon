import Button, { LOADING_ICON } from "@components/input/Button";
import { INPUT_SIZES, INPUT_VARIANTS } from "@components/input/InputContainer";
import TextInput from "@components/input/TextInput";
import { SubsectionHeader } from "@components/layout";
import { OptionalErrorText } from "@components/text";
import { useUser } from "@contexts/UserContext";
import { User } from "@models/user/User";
import { icons } from "@styles";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function AccountSectionContent({ style }) {
    const { user, updateUsername, logout, isLoading } = useUser();
    const {
        username,
        email
    } = user || {}

    const [newUsername, setNewUsername] = useState(username);
    const [isUsernameChanged, setIsUsernameChanged] = useState(false);
    const [usernameError, setUsernameError] = useState(null);
    const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);

    const isNewUsernameValid = isUsernameChanged && !usernameError;
    const usernameButtonIcon = isUsernameSubmitted ? LOADING_ICON : icons.pen;
    const usernameButtonVariant = !isNewUsernameValid || isUsernameSubmitted ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.PRIME;

    const validateUsername = (value) => {
        try {
            User.validateUsername(value);
            setUsernameError(null);
        } catch (err) {
            setUsernameError(err.message);
        }
    }

    const handleUsernameChange = (value) => {
        setNewUsername(value);
        validateUsername(value);
        if (value !== username) {
            setIsUsernameChanged(true);
        } else {
            setIsUsernameChanged(false);
        }
    }

    const handleUpdateUsername = async () => {
        if (isNewUsernameValid) {
            setIsUsernameSubmitted(true);
            await updateUsername(newUsername);
        }
    }

    useEffect(() => {
        if (isUsernameSubmitted && !isLoading) {
            setIsUsernameSubmitted(false);
            setIsUsernameChanged(false);
        }
    }, [isUsernameSubmitted, isLoading]);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={style}>
            <View>
                <SubsectionHeader title="Nazwa użytkownika" />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TextInput
                        value={newUsername}
                        onChange={handleUsernameChange}
                        error={!!usernameError}
                        style={{ flex: 1 }}
                    />
                    <Button
                        icon={usernameButtonIcon}
                        variant={usernameButtonVariant}
                        onPress={handleUpdateUsername}
                    />
                </View>
            </View>
            <OptionalErrorText>{usernameError}</OptionalErrorText>
            <View>
                <SubsectionHeader title="Email" />
                <TextInput
                    value={email}
                    variant={INPUT_VARIANTS.DISABLED}
                />
            </View>
            <Button
                title="Wyloguj się"
                icon={icons.logout}
                size={INPUT_SIZES.LARGE}
                variant={INPUT_VARIANTS.ERROR}
                onPress={handleLogout}
                style={{ alignSelf: 'flex-start' }}
            />
        </View>

    );
}
