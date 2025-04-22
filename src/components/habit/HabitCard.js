import ActivityValueIcon from '@components/activity/ActivityValueIcon';
import HabitAvatar from '@components/habit/HabitAvatar';
import InputContainer, { INPUT_SIZES } from '@components/input/InputContainer';
import PieButton from '@components/input/PieButton';
import { CaptionText, TitleText } from '@components/text';
import { colors, fontStyles, icons, metrics } from '@styles';
import { StyleSheet, View } from 'react-native';

export default function HabitCard(props) {
    const {
        details: { type, color, name, description },
        streak,
        goal = 0,
        completed = 0,
        onPress = () => { },
        addExecution = () => { },
        isLoading = false,
    } = props;

    return (
        <InputContainer size={INPUT_SIZES.AUTO} style={styles.container} onPress={onPress}>
            <HabitAvatar type={type} color={color} />

            <View style={styles.detailsContainer}>
                <TitleText style={styles.name} numberOfLines={1}>{name}</TitleText>
                <CaptionText style={styles.description} numberOfLines={2}>{description}</CaptionText>
            </View>

            <ActivityValueIcon value={streak} icon={icons.streak} />

            <PieButton maxCount={goal} count={completed} onPress={addExecution} isLoading={isLoading} />
        </InputContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 0,
    },
    detailsContainer: {
        flex: 1,
        height: '100%',
        marginHorizontal: metrics.spacing.xs,
    },
    name: {
        color: colors.darkGray,
    },
    description: {
        color: colors.midGray,
        lineHeight: fontStyles.caption.fontSize,
    },
});
