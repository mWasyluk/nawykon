import React, { createContext, useContext, useState, useEffect } from 'react';
import db from 'src/configs/firebaseConfig';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Habit } from '../models/habit/Habit';

const HabitsContext = createContext();

export const HabitsProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pobranie wszystkich nawyków po uruchomieniu aplikacji
    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const habitsSnapshot = await getDocs(collection(db, 'habits'));
                const habitList = habitsSnapshot.docs.map(doc => new Habit({ ...doc.data() }));
                setHabits(habitList);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHabits();
    }, []);

    // Dodanie nowego nawyku
    const addHabit = async (newHabit) => {
        const habitDocRef = doc(collection(db, 'habits'));
        const habitToSave = new Habit({ ...newHabit, id: habitDocRef.id, userId: null });

        await setDoc(habitDocRef, JSON.parse(JSON.stringify(habitToSave)));
        setHabits(prev => [...prev, habitToSave]);
    };

    // Aktualizacja istniejącego nawyku
    const updateHabit = async (updatedHabit) => {
        const habitToSave = new Habit(updatedHabit);

        const habitDocRef = doc(db, 'habits', habitToSave.id);
        await updateDoc(habitDocRef, JSON.parse(JSON.stringify(habitToSave)));
        setHabits(prev =>
            prev.map(habit => (habit.id === habitToSave.id ? habitToSave : habit))
        );
    };

    // Usunięcie nawyku
    const deleteHabit = async (habitId) => {
        const habitDocRef = doc(db, 'habits', habitId);
        await deleteDoc(habitDocRef);
        setHabits(prev => prev.filter(habit => habit.id !== habitId));
    };

    return (
        <HabitsContext.Provider value={{ habits, addHabit, updateHabit, deleteHabit, isLoading, error }}>
            {children}
        </HabitsContext.Provider>
    );
};

// Hook do korzystania z HabitContext
export const useHabits = () => useContext(HabitsContext);
