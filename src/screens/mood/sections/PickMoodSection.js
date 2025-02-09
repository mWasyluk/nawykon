import ScreenSection from "@components/containers/ScreenSection";
import IconToggleGroup from "@components/icon-toggle/IconToggleGroup";
import { icons } from "@styles";

export default function PickMoodSection(props) {
    const {
        defaultValue,
        onChange = () => { },
    } = props;

    return (
        <ScreenSection title="Jaki masz nastrój?*" containerStyle={{ justifyContent: 'space-between' }}>
            <IconToggleGroup
                icons={[icons.mood0, icons.mood1, icons.mood2, icons.mood3, icons.mood4]}
                selected={defaultValue}
                onChange={onChange} />
        </ScreenSection>
    );
}
