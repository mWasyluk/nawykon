import ScreenSection from '@components/containers/ScreenSection';
import HabitTypeAvatar from '@components/habit/HabitTypeAvatar';
import Button from '@components/ui/Button';
import routes from '@data/router';
import ModalService from '@services/modalService';
import { colors, fontStyles, icons } from '@styles';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useHabits } from 'src/context/HabitsContext';

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
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.description}>{description}</Text>
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
        ...fontStyles.regularTitle,
        color: colors.darkGray,
    },
    description: {
        ...fontStyles.regularNote,
        color: colors.midGray,
    },
});
