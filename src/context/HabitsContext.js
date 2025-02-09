import { deleteDocument } from '@services/firestoreService';
import { getAllHabits, saveHabit } from '@services/habitsService';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';

const HabitsContext = createContext();

export const HabitsProvider = ({ children }) => {
    const { user } = useUser();

    const [habits, setHabits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const addHabit = async (newHabit) => {
        const savedHabit = await saveHabit(newHabit);
        setHabits(prev => [...prev, savedHabit]);
    };

    const updateHabit = async (updatedHabit) => {
        if (!updatedHabit.id) {
            throw new Error('Nie można zaktualizować nawyku bez id');
        }
        const savedHabit = await saveHabit(updatedHabit);
        setHabits(prev => prev.map(habit => habit.id === savedHabit.id ? savedHabit : habit)
        );
    };

    const deleteHabit = async (habitId) => {
        await deleteDocument('habits', habitId);
        setHabits(prev => prev.filter(habit => habit.id !== habitId));
    };

    useEffect(() => {
        if (!user) {
            return;
        }

        const initHabits = async () => {
            try {
                setHabits(await getAllHabits());
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoading) {
            initHabits();
        }
    }, [user]);

    return (
        <HabitsContext.Provider value={{ habits, addHabit, updateHabit, deleteHabit, isLoading, error }}>
            {children}
        </HabitsContext.Provider>
    );
};

export const useHabits = () => useContext(HabitsContext);
