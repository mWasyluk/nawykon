import ActivityValueIcon from "@components/activity/ActivityValueIcon";
import { SectionContainer, SectionHeader } from "@components/layout";
import { useHabits } from "@contexts/HabitsContext";
import { useStateManager } from "@contexts/StateManagerContext";
import { colors, icons } from "@styles";
import { ActivityUtil } from "@utils/activityUtil";
import { StyleSheet } from "react-native";
import ActionsHabitsSubsections from "./ActionsHabitsSubsections";
import ActionsMoodSubsection from "./ActionsMoodSubsection";
import ActionsNotesSubsection from "./ActionsNotesSubsection";
import ActionsResultsSubsection from "./ActionsResultsSubsection";

export default function ActionsSection() {
    const { activityRegistry } = useStateManager();
    const { habits } = useHabits();

    const actionsSummary = ActivityUtil.calculateActionsSummary(activityRegistry, habits);
    console.log(actionsSummary);

    return (
        <SectionContainer>
            <SectionHeader title="Akcje" right={<ActivityValueIcon value={actionsSummary.actionsNumber} icon={icons.puzzle} />} />

            <ActionsHabitsSubsections summary={actionsSummary.habits} styles={styles} />
            <ActionsResultsSubsection summary={actionsSummary.results} styles={styles} />
            <ActionsMoodSubsection summary={actionsSummary.mood} styles={styles} />
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
