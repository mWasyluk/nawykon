import IconToggleGroup from "@components/input/IconToggleGroup";
import { SectionContainer, SectionHeader } from "@components/layout";
import { icons } from "@styles";

export default function PickEnergySection(props) {
    const {
        defaultValue,
        onChange = () => { },
    } = props;

    return (
        <SectionContainer style={{ gap: 0 }}>
            <SectionHeader
                title="Ile masz energii?*"
            />
            <IconToggleGroup
                icons={[icons.energy0, icons.energy1, icons.energy2]}
                selected={defaultValue}
                onChange={onChange} />
        </SectionContainer>
    );
}
