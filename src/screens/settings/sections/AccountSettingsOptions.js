import Button from "@components/input/Button";
import { INPUT_SIZES, INPUT_VARIANTS } from "@components/input/InputContainer";
import TextInput from '@components/input/TextInput';
import { SubsectionHeader } from "@components/layout";
import { useUser } from "@contexts/UserContext";
import { UserService } from '@services/userService';
import { icons } from "@styles";
import { View } from "react-native";

export default function AccountSettingsOptions() {
    const { user } = useUser();

    const handleLogout = async () => {
        await UserService.logout();
    };

    return (
        <>
            <View>
                <SubsectionHeader title="Email" />
                <TextInput
                    value={user?.email}
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
        </>
    );
}
