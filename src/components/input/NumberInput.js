import { BodyText } from "@components/text";
import { icons, metrics } from "@styles";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "./Button";
import InputContainer, { INPUT_VARIANTS } from "./InputContainer";

export default function NumberInput(props) {
    const {
        value: defaultValue = 0,
        minValue,
        maxValue,
        shiftValue = 1,
        onChange = () => { }
    } = props;

    const [value, setValue] = useState(defaultValue || minValue);

    const handleIncrement = () => {
        const newValue = value + shiftValue;
        if (!Number.isInteger(maxValue) || newValue <= maxValue) {
            setValue(newValue);
            onChange(newValue);
        }
    }

    const handleDecrement = () => {
        const newValue = value - shiftValue;
        if (!Number.isInteger(minValue) || newValue >= minValue) {
            setValue(newValue);
            onChange(newValue);
        }
    }

    return (
        <View style={styles.container}>
            <Button
                icon={icons.bottomArrow}
                onPress={handleDecrement}
                variant={value <= minValue ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.DEFAULT}
            />

            <InputContainer style={{ minWidth: 48 }}>
                <BodyText>{value}</BodyText>
            </InputContainer>

            <Button
                icon={icons.topArrow}
                onPress={handleIncrement}
                variant={value >= maxValue ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.DEFAULT}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: metrics.spacing.xs
    }
});
