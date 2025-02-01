import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenSection from '@components/containers/ScreenSection';
import { colors, fontStyles, icons } from '@styles';
import HabitTypeAvatar from '@components/habit/HabitTypeAvatar';
import Button from '@components/ui/Button';
import routes from '@data/router';

export default function HabitDetailsSection(props) {
    const {
        id,
        name = '<nazwa_nawyku>',
        description = '<opis_nawyku>',
        type = 'fitness',
    } = props;

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
