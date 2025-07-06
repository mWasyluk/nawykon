import HabitAvatar from "@components/habit/HabitAvatar";
import InputContainer from "@components/input/InputContainer";
import { ActionText, BodyBoldText } from "@components/text";
import { colors, icons, metrics } from "@styles";
import { Image, View } from "react-native";
import HabitProgressView from "./HabitProgressView";

export default function HabitActivityButton(props) {
    const {
        type,
        name,
        points = undefined,
        goal = undefined,
        completed = undefined,
        onPress = () => { },
    } = props;

    const isValidPoints = Number.isInteger(points);
    const isValidProgress = Number.isInteger(goal) && Number.isInteger(completed);

    return (
        <InputContainer onPress={onPress}>
            <HabitAvatar type={type} style={{ height: metrics.imageSize.xs, width: metrics.imageSize.xs }} />

            <ActionText style={{ color: colors.midGray }}>{name}</ActionText>

            {isValidPoints && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0, backgroundColor: colors.light, paddingHorizontal: metrics.spacing.sm, borderRadius: metrics.borderRadius.circular }}>
                    <BodyBoldText>
                        {points}
                    </BodyBoldText>
                    <Image source={icons.point} style={{ height: metrics.imageSize.xs, width: metrics.imageSize.xs }} />
                </View>
            )}

            {isValidProgress && (
                <HabitProgressView completed={completed} goal={goal} />
            )}
        </InputContainer>
    );
}
