import { BodyText } from "@components/text";
import { colors } from "@styles";
import { useState } from "react";
import InputContainer, { INPUT_VARIANTS } from "./InputContainer";

export default function SelectableTextOption(props) {
    const {
        text = '',
        isSelected: defaultIsSelected = false,
        onSelect = () => { },
        ...otherProps
    } = props;

    const [isSelected, setIsSelected] = useState(defaultIsSelected);

    const variant = isSelected ? INPUT_VARIANTS.PRIME : INPUT_VARIANTS.DEFAULT;
    const textColor = isSelected ? colors.light : colors.midGray;

    const handleSelection = () => {
        const newState = !isSelected
        setIsSelected(newState);
        onSelect(newState);
    }

    return (
        <InputContainer variant={variant} onPress={handleSelection} {...otherProps}>
            <BodyText style={{ color: textColor }}>{text}</BodyText>
        </InputContainer>
    );
}
