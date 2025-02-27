import HabitTypeAvatar from '@components/habit/HabitTypeAvatar';
import Button from '@components/input/Button';
import ScreenSection from '@components/layout/ScreenSection';
import { CaptionText, BodyText } from '@components/text';
import routes from '@constants/router';
import { useHabits } from '@contexts/HabitsContext';
import { ModalService } from '@services/modalService';
import { colors, icons } from '@styles';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function HabitDetailsSection(props) {
    const {
        id,
        name = '<nazwa_nawyku>',
        description = '<opis_nawyku>',
        type = 'fitness',
    } = props;

    const { deleteHabit } = useHabits();

    const showConfirmDelete = () => {
        const message = `Czy chcesz trwale usunąć nawyk "${name}"?`;
        const onPress = () => {
            deleteHabit(id);
            router.replace(routes.dashboard);
        };
        ModalService.showConfirm(message, onPress);
    }

    return (
        <ScreenSection
            title={"Szczegóły"}
            containerStyle={styles.container}
        >
            <View style={styles.textContainer}>
                <BodyText style={styles.title}>{name}</BodyText>
                <CaptionText style={styles.description}>{description}</CaptionText>
            </View>
            <HabitTypeAvatar type={type} />
            <Button
                title="Edytuj"
                href={routes.editHabit(id)}
                icon={icons.pen}
                small={true}
            />
            <Button
                onPress={showConfirmDelete}
                icon={icons.bin}
                small={true}
                variant="error"
            />
        </ScreenSection>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    textContainer: {
        flexDirection: 'column',
        width: '80%',
    },
    title: {
        color: colors.darkGray,
    },
    description: {
        color: colors.midGray,
    },
});
