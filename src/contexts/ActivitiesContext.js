import { ActivityRegistry } from '@models/reports/ActivityRegistry';
import { ModalService } from '@services/modalService';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useHabits } from './HabitsContext';
import { useReports } from './ReportsContext';
import { ActivityUtil } from '@utils/activityUtil';

const ActivityContext = createContext({ activityRegistry: null });

export const ActivityProvider = ({ children }) => {
    const { dailyReports } = useReports();
    const { habits, saveHabit } = useHabits();
    const [activityRegistry, setActivityRegistry] = useState(null);

    const updateAllRecords = (registry, dailyReports, habits) => {
        let isUpdated = false;
        const reportsToUpdate = dailyReports.filter(report => report.modifiedAt >= registry.modifiedAt);
        const habitsToUpdate = habits.filter(habit => habit.modifiedAt >= registry.modifiedAt);

        isUpdated = registry.updateAllRecords(reportsToUpdate, habitsToUpdate) || isUpdated;

        const registryHabitIds = registry.getHabitIds();
        if (registryHabitIds.length > habits.length) {
            const habitIdsToRemove = registryHabitIds.filter(habitId => !habits.some(habit => habit.id === habitId));
            for (const habitId of habitIdsToRemove) {
                isUpdated = registry.removeHabitRecords(habitId) || isUpdated;
            }
        }

        return isUpdated;
    }

    useEffect(() => {
        if (!dailyReports || !habits) {
            return;
        }

        let newReg = null;

        const initRegistry = () => {
            try {
                newReg = new ActivityRegistry(dailyReports, habits);
                setActivityRegistry(newReg);
            } catch (error) {
                console.error(error);
                ModalService.showError("Nie mogłem zainicjować rejestru aktywności. Odśwież aplikację, żebym mógł spróbować jeszcze raz.");
            }
        };

        const updateRegistry = () => {
            try {
                let isUpdated = updateAllRecords(activityRegistry, dailyReports, habits);
                if (isUpdated) {
                    newReg = activityRegistry.clone();
                    setActivityRegistry(newReg);
                }
            } catch (error) {
                console.error(error);
                ModalService.showError("Nie mogłem zaktualizować rejestru aktywności. Odśwież aplikację, żebym mógł spróbować jeszcze raz.");
            }
        }

        if (!activityRegistry) {
            initRegistry();
        } else {
            updateRegistry();
        }

        const updateHabitsStreak = async () => {
            for (const habit of habits) {
                const streak = ActivityUtil.calculateHabitStreak(newReg, habit.id);
                if (streak !== habit.streak) {
                    habit.streak = streak;
                    await saveHabit(habit);
                }
            }
        }

        if (newReg) {
            updateHabitsStreak().catch(err => {
                console.error("Error updating habits streak:", err);
                ModalService.showError("Nie mogłem zaktualizować serii nawyków. Odśwież aplikację, żebym mógł spróbować jeszcze raz.");
            });
        }
    }, [dailyReports, habits]);

    const contextValue = useMemo(() => ({
        activityRegistry
    }), [activityRegistry]);

    return (
        <ActivityContext.Provider value={contextValue}>
            {children}
        </ActivityContext.Provider>
    );
};

export const useActivity = () => useContext(ActivityContext);
