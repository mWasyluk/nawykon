import HabitTypeAvatar from '@components/habit/HabitTypeAvatar';
import PieButton from '@components/input/PieButton';
import { CaptionText, TitleText } from '@components/text';
import { colors, icons } from '@styles';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HabitCard(props) {
    const {
        onPress = () => { },
        addExecution = () => { },
        type,
        name,
        streak,
        description,
        repetitions = 0,
        executions = 0,

    } = props;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <HabitTypeAvatar type={type} />

            <View style={styles.detailsContainer}>
                <View style={styles.head}>
                    <TitleText style={styles.name}>{name}</TitleText>
                    <CaptionText style={styles.description}>{description}</CaptionText>
                </View>

                <View style={styles.actionContainer}>
                    <Image source={icons.streak} style={styles.streakIcon} />
                    <TitleText style={styles.streakText}>{streak}</TitleText>
                    <PieButton maxCount={repetitions} count={executions} onPress={addExecution} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderRadius: 64,
        padding: 10,
        gap: 10,
    },
    detailsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    head: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 5,
    },
    bottom: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
    },
    name: {
        color: colors.darkGray,
    },
    description: {
        color: colors.midGray,
    },
    streakIcon: {
        width: 22,
        height: 22,
    },
    streakText: {
        color: colors.darkGray,
        marginRight: 10,
    },
});
