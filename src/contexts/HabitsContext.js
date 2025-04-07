import { HabitService } from '@services/habitsService';
import { ModalService } from '@services/modalService';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';

const HabitsContext = createContext();

export const HabitsProvider = ({ children }) => {
    const { user } = useUser();

    const [habits, setHabits] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const addHabit = async (newHabit) => {
        setIsLoading(true);
        try {
            const savedHabit = await HabitService.saveHabit(newHabit);
            setHabits(prev => [...prev, savedHabit]);
            return savedHabit;
        } catch (err) {
            ModalService.showError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const updateHabit = async (updatedHabit) => {
        if (!updatedHabit.id) {
            ModalService.showError('Napotkałem błąd w czasie aktualizowania nawyku. Odśwież aplikację i spróbuj ponownie.');
        }

        setIsLoading(true);
        try {
            const savedHabit = await HabitService.saveHabit(updatedHabit);
            setHabits(prev => prev.map(habit => habit.id === savedHabit.id ? savedHabit : habit));
            return savedHabit;
        } catch (err) {
            ModalService.showError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteHabit = async (habitId) => {
        try {
            await HabitService.deleteHabit(habitId);
            setHabits(prev => prev.filter(habit => habit.id !== habitId));
        } catch (err) {
            ModalService.showError(err.message);
        }
    };

    useEffect(() => {
        if (!user || !user.uid) {
            return;
        }

        const initHabits = async () => {
            setIsLoading(true);
            try {
                setHabits(await HabitService.getAllHabits());
            } catch (err) {
                ModalService.showError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (!habits && !isLoading) {
            initHabits();
        }

        return () => {
            setHabits(null);
        };
    }, [user?.uid]);

    return (
        <HabitsContext.Provider value={{ habits, addHabit, updateHabit, deleteHabit, isLoading }}>
            {children}
        </HabitsContext.Provider>
    );
};

export const useHabits = () => useContext(HabitsContext);
