import ButtonContainer from "@components/input/ButtonContainer";
import { ActionText } from "@components/text";
import { colors, icons, metrics } from "@styles";
import { Image, StyleSheet } from "react-native";

export default function TimeActivityButton(props) {
    const { time, onPress } = props;

    return (
        <ButtonContainer onPress={onPress}>
            <Image source={icons.check} tintColor={colors.midGray} style={styles.image} />
            <ActionText style={styles.text}>{time}</ActionText>
        </ButtonContainer>
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
