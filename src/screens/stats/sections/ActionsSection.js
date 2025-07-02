import ActivityValueIcon from "@components/activity/ActivityValueIcon";
import { SectionContainer, SectionHeader } from "@components/layout";
import { useActivity } from "@contexts/ActivitiesContext";
import { useHabits } from "@contexts/HabitsContext";
import { colors, icons } from "@styles";
import { ActivityUtil } from "@utils/activityUtil";
import { StyleSheet } from "react-native";
import ActionsHabitsSubsections from "./ActionsHabitsSubsections";
import ActionsMoodSubsection from "./ActionsMoodSubsection";
import ActionsNotesSubsection from "./ActionsNotesSubsection";
import ActionsResultsSubsection from "./ActionsResultsSubsection";
import ActionsEmotionSubsection from "./ActionsEmotionSubsection";

export default function ActionsSection() {
    const { activityRegistry } = useActivity();
    const { habits } = useHabits();

    const actionsSummary = ActivityUtil.calculateActionsSummary(activityRegistry, habits);
    console.log(actionsSummary);

    return (
        <SectionContainer>
            <SectionHeader title="Akcje" right={<ActivityValueIcon value={actionsSummary.actionsNumber} icon={icons.puzzle} />} />

            <ActionsHabitsSubsections summary={actionsSummary.habits} styles={styles} />
            <ActionsResultsSubsection summary={actionsSummary.results} styles={styles} />
            <ActionsMoodSubsection summary={actionsSummary.mood} styles={styles} />
            <ActionsEmotionSubsection summary={actionsSummary.emotion} styles={styles} />
            <ActionsNotesSubsection summary={actionsSummary.notes} styles={styles} />
        </SectionContainer >
    );
}

const styles = StyleSheet.create({
    regularText: {
        color: colors.midGray,
    },
    summaryText: {
        color: colors.darkGray,
    },
});
