import InputContainer from "@components/input/InputContainer";
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
        onPress = () => { },
    } = props;

    return (
        <>
            {isEmpty ? (
                <InputContainer >
                    <Image source={icons.mood} style={[styles.image, { filter: 'grayscale(100%)' }]} />

                    <ActionText style={styles.emptyText}>Raport dzienny</ActionText>
                </InputContainer>
            ) : (
                <InputContainer onPress={onPress}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={icons[`mood${humor}`]} style={styles.image} />
                        <Image source={icons[`energy${energy}`]} style={styles.image} />
                        {isNote && (
                            <Image source={icons.pen} style={styles.image} tintColor={colors.midGray} />
                        )}
                    </View>
                    <ActionText style={styles.text}>{date ? date : "Raport dzienny"}</ActionText>
                </InputContainer>
            )}
        </>
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
