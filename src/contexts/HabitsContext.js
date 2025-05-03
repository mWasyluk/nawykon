import { HabitsService } from '@services/habitsService';
import { ModalService } from '@services/modalService';
import { createContext, useContext, useEffect, useState } from 'react';

const HabitsContext = createContext();

export const HabitsProvider = ({ children }) => {
    const [habits, setHabits] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const saveHabit = async (habit) => {
        setIsLoading(true);
        const isUpdate = habit.id && habit.id.length > 0;
        try {
            const savedHabit = await HabitsService.save(habit);
            if (!isUpdate) {
                setHabits(prev => [...prev, savedHabit]);
            } else {
                setHabits(prev => prev.map(h => h.id === savedHabit.id ? savedHabit : h));
            }
            return savedHabit;
        } catch (err) {
            console.error(err);
            ModalService.showError("Nie udało się zapisać nawyku. Odśwież aplikację i spróbuj ponownie.");
        } finally {
            setIsLoading(false);
        }
    }

    const deleteHabitById = async (habitId) => {
        setIsLoading(true);
        try {
            const isDeleted = await HabitsService.deleteById(habitId);
            if (isDeleted) {
                setHabits(prev => prev.filter(h => h.id !== habitId));
            }
            return isDeleted;
        } catch (err) {
            console.error(err);
            ModalService.showError("Nie udało się usunąć nawyku. Odśwież aplikację i spróbuj ponownie.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const initHabits = async () => {
            setIsLoading(true);
            try {
                setHabits(await HabitsService.getAll());
            } catch (err) {
                ModalService.showError("Nie udało się pobrać nawyków. Odśwież aplikację i spróbuj ponownie.");
            } finally {
                setIsLoading(false);
            }
        };

        initHabits();

        return () => {
            setHabits(null);
        };
    }, []);

    return (
        <HabitsContext.Provider value={{ habits, saveHabit, deleteHabitById, isLoading }}>
            {children}
        </HabitsContext.Provider>
    );
};

export const useHabits = () => useContext(HabitsContext);
