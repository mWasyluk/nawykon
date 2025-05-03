import IconToggleGroup from "@components/input/IconToggleGroup";
import { SectionContainer, SectionHeader } from "@components/layout";
import { icons } from "@styles";

export default function PickMoodSection(props) {
    const {
        defaultValue,
        onChange = () => { },
    } = props;

    return (
        <SectionContainer style={{ gap: 0 }}>
            <SectionHeader
                title="Jaki masz nastrój?*"
            />
            <IconToggleGroup
                icons={[icons.mood0, icons.mood1, icons.mood2, icons.mood3, icons.mood4]}
                selected={defaultValue}
                onChange={onChange} />
        </SectionContainer>
    );
}
