import PlanStatusCalendar from "@components/activity/PlanStatusCalendar";
import StatisticsPresentation from "@components/sections/activity/StatisticsPresentation";
import Button from "@components/ui/Button";
import { fullDays, genitiveMonths } from "@data/time";
import { fontStyles, icons } from "@styles";
import { formatDate, getFixedDayOfWeek, validateTimestamp } from "@utils/dateUtil";
import { useState } from "react";
import { Text, View } from "react-native";
import { useModal } from "src/context/ModalContext";
import { useHabits } from "src/context/HabitsContext";
import { useReports } from "src/context/ReportsContext";

export const ActivityCalendarView = (props) => {
    const {
        monthStats = {},
    } = props;

    const { habits } = useHabits();
    const { showConfirm, showError } = useModal();
    const { setHabitLog } = useReports();
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date(), 'date'));

    const showConfirmRemoving = (id, execution) => {
        if (!id || !execution) {
            throw new Error('Cannot show removing confirmation - missing id or execution');
        }

        const habitName = habits.find(habit => habit.id === id).details.name;
        const time = formatDate(new Date(execution), 'shorttime');

        const currentExecutions = monthStats.dailyStats[selectedDate].habitStats[id].executions;
        const newExecutions = currentExecutions.filter(currentExecution => currentExecution !== execution);

        const message = `Czy chcesz confąć wykonanie zadania "${habitName}" o godzinie ${time} z dnia ${selectedDate}?`;
        const onConfirm = () => setHabitLog(selectedDate, { id, executions: newExecutions });

        showConfirm(message, onConfirm);
    }

    const showConfirmAdding = (id) => {
        if (!id) {
            throw new Error('Cannot show adding confirmation - missing id');
        }

        const habit = habits.find(habit => habit.id === id);
        if (selectedDate < habit.startDate) {
            showError('Nie można dodawać wykonania sprzed zaplanowanego rozpoczęcia zadania.');
            return;
        }
        if (selectedDate > habit.endDate) {
            showError('Nie można dodawać wykonania po zaplanowanym zakończeniu zadania.');
            return;
        }
        if (selectedDate > formatDate(new Date(), 'date')) {
            showError('Nie można dodawać wykonania w przyszłości.');
            return;
        }


        const habitName = habit.details.name;
        const time = formatDate(new Date(), 'shorttime');

        const currentExecutions = monthStats.dailyStats[selectedDate].habitStats[id]?.executions || [];
        const newExecutions = [...currentExecutions, new Date().getTime()];

        const message = `Czy chcesz dodać wykonanie zadania "${habitName}" o godzinie ${time} w dniu ${selectedDate}?`;
        const onConfirm = () => setHabitLog(selectedDate, { id, executions: newExecutions });

        showConfirm(message, onConfirm);
    }

    const selectedDateStats = monthStats.dailyStats[selectedDate];
    const habitStats = selectedDateStats?.habitStats || {};
    const executions = !habitStats ? [] : Object.keys(habitStats).map(id => {
        const executions = monthStats.dailyStats[selectedDate].habitStats[id].executions;
        if (!executions || executions.length === 0) {
            return null;
        }
        return executions.map(execution => ({ id, execution }));
    }).filter((execution) => execution !== null).flat();

    const selectedDateTimestamp = validateTimestamp(selectedDate);
    const selectedDateLabel = `${selectedDateTimestamp.getDate()} ${genitiveMonths[selectedDateTimestamp.getMonth()]}, ${fullDays[getFixedDayOfWeek(selectedDate)]}`;

    return (
        <>
            <StatisticsPresentation
                completed={monthStats.completed}
                failed={monthStats.goal - monthStats.completed}
            />

            <PlanStatusCalendar
                dailyStats={monthStats.dailyStats}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
            <Text style={{ ...fontStyles.regularNote, marginTop: -10, textTransform: 'uppercase' }}>{selectedDateLabel} </Text>

            <View style={{ gap: 10, width: '100%' }}>
                <Text style={{ ...fontStyles.regularBold }}>Akcje wybranego dnia</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    {executions.map(({ id, execution }, index) => (
                        <Button key={index}
                            onPress={() => showConfirmRemoving(id, execution)}
                            title={formatDate(new Date(execution), 'shorttime')}
                            prim={false}
                            small={true}
                            icon={icons.check} />
                    ))}
                    {monthStats.habitIds.length === 1 &&
                        <Button
                            onPress={() => showConfirmAdding(monthStats.habitIds[0])}
                            icon={icons.plus}
                            small={true}
                        />
                    }
                </View >
            </View>
        </>
    )
}
