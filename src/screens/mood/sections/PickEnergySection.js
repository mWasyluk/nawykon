import ScreenSection from "@components/layout/ScreenSection";
import IconToggleGroup from "@components/input/IconToggleGroup";
import { icons } from "@styles";

export default function PickEnergySection(props) {
    const {
        defaultValue,
        onChange = () => { },
    } = props;

    return (
        <ScreenSection title="Ile masz energii?*">
            <IconToggleGroup
                icons={[icons.energy0, icons.energy1, icons.energy2]}
                selected={defaultValue}
                onChange={onChange} />
        </ScreenSection>
    );
}
