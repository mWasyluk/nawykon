import IconToggleGroup from "@components/input/IconToggleGroup";
import SelectableTextOption from "@components/input/SelectableTextOption";
import { SectionContainer, SectionHeader, SubsectionHeader } from "@components/layout";
import { EMOTIONS } from "@constants/mood";
import { icons, metrics } from "@styles";
import { StyleSheet, View } from "react-native";

export default function FettleSection(props) {
    const {
        defaultValue,
        onChange = () => { },
    } = props;

    const {
        humor,
        energy,
        emotions = [],
    } = defaultValue;

    const onEmotionsChange = (isSelected, emotion) => {
        onChange({
            emotions: isSelected
                ? [...emotions, emotion]
                : emotions.filter((e) => e !== emotion)
        });
    }

    return (
        <SectionContainer style={{ gap: 0 }}>
            <SectionHeader
                title="Samopoczucie"
            />
            <View style={{ marginBottom: metrics.spacing.sm }}>
                <SubsectionHeader title="Humor" isRequired={true} />
                <IconToggleGroup
                    icons={[icons.mood0, icons.mood1, icons.mood2, icons.mood3, icons.mood4]}
                    selected={humor}
                    onChange={(value) => onChange({ humor: value })} />
            </View>

            <View style={{ marginBottom: metrics.spacing.sm }}>
                <SubsectionHeader title="Energia" isRequired={true} />
                <IconToggleGroup
                    icons={[icons.energy0, icons.energy1, icons.energy2]}
                    selected={energy}
                    onChange={(value) => onChange({ energy: value })} />
            </View>

            <View>
                <SubsectionHeader title="Emocje" />
                <View style={styles.rowContainer}>
                    {Object.entries(EMOTIONS).map(([key, { name }], i) => (
                        <SelectableTextOption key={`emotion-${i}`}
                            text={name}
                            isSelected={emotions.includes(key)}
                            onSelect={(isSelected) => onEmotionsChange(isSelected, key)}
                        />
                    ))}
                </View>
            </View>

        </SectionContainer>
    );
}


const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: metrics.spacing.sm,
    },
});
