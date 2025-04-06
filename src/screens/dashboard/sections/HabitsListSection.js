import HabitCard from "@components/habit/HabitCard";
import Button from "@components/input/Button";
import { INPUT_VARIANTS } from "@components/input/InputContainer";
import { SectionContainer, SectionHeader } from "@components/layout";
import routes from "@constants/router";
import { useHabits } from "@contexts/HabitsContext";
import { useReports } from "@contexts/ReportsContext";
import { useStateManager } from "@contexts/StateManagerContext";
import { ModalService } from "@services/modalService";
import { icons } from "@styles";
import { formatDate } from "@utils/dateUtil";
import { router } from "expo-router";

export default function HabitsListSection() {
    const { habits } = useHabits();
    const { setHabitLog } = useReports();
    const { activityRegistry } = useStateManager();

    const todaysActivityRecord = activityRegistry.getRecord(new Date());

    const habitCardPropsArray = habits.map(habit => {
        const cardProps = {
            // details,
            // streak,
            // goal,
            // completed,
            // addExecution,
            // onPress,
        };

        cardProps.details = habit.details;
        cardProps.streak = habit.streak;

        const {
            executions: currentExecutionsArray = [],
            goal = 0,
            completed = 0
        } = todaysActivityRecord.habits[habit.id] || {};

        cardProps.goal = goal;
        cardProps.completed = Math.min(completed, goal);

        cardProps.addExecution = () => {
            if (cardProps.completed >= cardProps.goal) {
                return;
            }
            try {
                let newExecutionsArray = [...currentExecutionsArray, new Date().getTime()];
                const date = formatDate(new Date(), 'date');
                setHabitLog(date, { id: habit.id, executions: newExecutionsArray });
            } catch (error) {
                ModalService.showError(error.message);
            }
        };

        cardProps.onPress = () => {
            router.push(routes.habitDetails(habit.id));
        }

        return cardProps;
    }).sort((a, b) => b.goal - a.goal);

    const handleAddPress = () => {
        router.push(routes.newHabit);
    }

    return (
        <SectionContainer>
            <SectionHeader
                title={"Nawyki"}
                right={<Button
                    title={"Dodaj"}
                    icon={icons.plus}
                    variant={INPUT_VARIANTS.PRIME}
                    onPress={handleAddPress}
                />}
            />
            {habitCardPropsArray.map((props, index) => (
                <HabitCard key={index} {...props} />
            ))}
        </SectionContainer>
    );
}
