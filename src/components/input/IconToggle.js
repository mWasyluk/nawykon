import { icons } from "@styles";
import { Image, TouchableOpacity } from "react-native";

export default function IconToggle(props) {
    const {
        icon = icons.mood0,
        selected = false,
        onSelect = () => { },
        size = 48,
    } = props;

    const iconStyle = {
        width: size,
        height: size,
        filter: selected ? undefined : 'grayscale(100%)'
    }

    return (
        <TouchableOpacity onPress={onSelect} style={{ width: 'fit-content' }}>
            <Image source={icon} style={iconStyle} />
        </TouchableOpacity>
    );
}

