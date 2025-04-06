import InputContainer from "@components/input/InputContainer";
import { ActionText } from "@components/text";
import { colors, icons, metrics } from "@styles";
import { Image, StyleSheet } from "react-native";

export default function TimeActivityButton(props) {
    const { time, onPress } = props;

    return (
        <InputContainer onPress={onPress}>
            <Image source={icons.check} tintColor={colors.midGray} style={styles.image} />
            <ActionText style={styles.text}>{time}</ActionText>
        </InputContainer>
    );
}

const styles = StyleSheet.create({
    image: {
        height: metrics.imageSize.xs,
        width: metrics.imageSize.xs,
    },
    text: {
        color: colors.midGray,
    }
});
