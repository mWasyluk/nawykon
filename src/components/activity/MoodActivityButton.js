import InputContainer, { INPUT_VARIANTS } from "@components/input/InputContainer";
import { ActionText } from "@components/text";
import { colors, icons, metrics } from "@styles";
import { Image, StyleSheet, View } from "react-native";

export default function MoodActivityButton(props) {
    const {
        humor = 0,
        energy = 0,
        isNote = false,
        date = null,
        isEmpty = false,

        disabled = false,
        onPress = () => { },
    } = props;

    const buttonVariant = disabled ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.DEFAULT;
    const actionTextStyle = isEmpty ? styles.emptyText : styles.text;
    const actionTextValue = !date ? "Raport dzienny" : date;

    return (
        <InputContainer onPress={onPress} variant={buttonVariant}>
            {isEmpty ? (
                <Image source={icons.mood} style={[styles.image, { filter: 'grayscale(100%)' }]} />
            ) : (
                <View style={{ flexDirection: 'row' }}>
                    <Image source={icons[`mood${humor}`]} style={styles.image} />
                    <Image source={icons[`energy${energy}`]} style={styles.image} />
                    {isNote && (
                        <Image source={icons.doc} style={styles.image} tintColor={colors.midGray} />
                    )}
                </View>
            )}
            <ActionText style={actionTextStyle}>{actionTextValue}</ActionText>
        </InputContainer>
    );
}

const styles = StyleSheet.create({
    image: {
        height: metrics.imageSize.xs,
        width: metrics.imageSize.xs,
    },
    emptyText: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        color: colors.lightGray,
    },
    text: {
        color: colors.midGray,
    }
});
