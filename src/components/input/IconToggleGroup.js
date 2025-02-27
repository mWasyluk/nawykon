import { StyleSheet } from "react-native";
import IconToggle from "./IconToggle";
import { useState } from "react";
import { View } from "react-native";

export default function IconToggleGroup(props) {
    const {
        icons = [],
        selected = undefined,
        onChange = () => { },
        style = {},
    } = props;

    const [selectedIcon, setSelectedIcon] = useState(icons[selected]);

    const handleSelection = (index) => {
        setSelectedIcon(icons[index]);
        onChange(index);
    };

    return (
        <View style={[styles.container, style]}>
            {icons.map((icon, index) => {
                let selected = selectedIcon === icon;
                return (
                    <IconToggle
                        key={index}
                        icon={icon}
                        selected={selected}
                        onSelect={() => handleSelection(selected ? undefined : index)}
                    />
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    }
});
