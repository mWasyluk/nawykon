import HabitTypeAvatar from '@components/habit/HabitTypeAvatar';
import PieButton from '@components/PieButton';
import { colors, fontStyles, icons } from '@styles';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HabitCard(props) {
    const {
        onPress = () => { },
        onCheck = () => { },
        type,
        name,
        streak,
        description,
        requiredExecutions,
        remainedExecutions,

    } = props;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <HabitTypeAvatar type={type} />

            <View style={styles.detailsContainer}>
                <View style={styles.head}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>

                <View style={styles.actionContainer}>
                    <Image source={icons.streak} style={styles.streakIcon} />
                    <Text style={styles.streakText}>{streak}</Text>
                    <PieButton maxCount={requiredExecutions} count={requiredExecutions - remainedExecutions} onPress={onCheck} />
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
        ...fontStyles.regularTitle,
        color: colors.darkGray,
    },
    description: {
        ...fontStyles.regularNote,
        color: colors.midGray,
    },
    streakIcon: {
        width: 22,
        height: 22,
    },
    streakText: {
        ...fontStyles.regularTitle,
        color: colors.darkGray,
        marginRight: 10,
    },
    remainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    remainIcon: {
        width: 16,
        height: 16,
    },
    remianText: {
        ...fontStyles.regularBold,
        color: colors.midGray,
    },
});
