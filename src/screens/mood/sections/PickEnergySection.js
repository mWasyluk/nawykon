import ScreenSection from "@components/containers/ScreenSection";
import IconToggleGroup from "@components/icon-toggle/IconToggleGroup";
import { icons } from "@styles";

export default function PickEnergySection(props) {
    const {
        defaultValue,
        onChange = () => { },
    } = props;

    return (
        <ScreenSection title="Ile masz energii?">
            <IconToggleGroup
                icons={[icons.energy0, icons.energy1, icons.energy2]}
                selected={defaultValue}
                onChange={onChange} />
        </ScreenSection>
    );
}
