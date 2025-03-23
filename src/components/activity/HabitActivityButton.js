import HabitTypeAvatar from "@components/habit/HabitTypeAvatar";
import ButtonContainer from "@components/input/ButtonContainer";
import { ActionText, BodyBoldText } from "@components/text";
import { colors, icons, metrics } from "@styles";
import { Image, View } from "react-native";

const VARIANTS = {
    completed: { backgroundColor: colors.lightSuccess, color: colors.light },
    partial: { backgroundColor: colors.lightWarning, color: colors.darkGray },
    failed: { backgroundColor: colors.lightError, color: colors.light },
    neutral: { backgroundColor: colors.lightGray, color: colors.darkGray },
}

export default function HabitActivityButton(props) {
    const {
        type,
        name,
        points = undefined,
        goal = undefined,
        completed = undefined,
        onPress = () => { },
    } = props;

    const progress = (goal && completed) && completed / goal;
    if (progress !== undefined) {
        var variantStyle = !goal ? VARIANTS.neutral
            : progress >= 1 ? VARIANTS.completed
                : progress <= 0 ? VARIANTS.failed
                    : VARIANTS.partial;
    }

    return (
        <ButtonContainer onPress={onPress}>
            <HabitTypeAvatar type={type} style={{ height: metrics.imageSize.xs, width: metrics.imageSize.xs }} />

            <ActionText style={{ color: colors.midGray }}>{name}</ActionText>

            {points && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0, backgroundColor: colors.light, paddingHorizontal: metrics.spacing.sm, borderRadius: metrics.borderRadius.circular }}>
                    <BodyBoldText>
                        {points}
                    </BodyBoldText>
                    <Image source={icons.point} style={{ height: metrics.imageSize.xs, width: metrics.imageSize.xs }} />
                </View>
            )}

            {progress !== undefined && (
                <BodyBoldText style={[{ paddingHorizontal: metrics.spacing.sm, borderRadius: metrics.borderRadius.circular }, variantStyle]}>
                    {completed || 0}/{goal || 0}
                </BodyBoldText>
            )}
        </ButtonContainer>
    );
}
