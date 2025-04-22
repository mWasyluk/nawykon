import { Habit } from '@models/habit/Habit';
import { setDocument, getAllDocuments, deleteDocument, deleteAllDocuments } from '@services/firestoreService';

const collectionName = 'habits';

export const HabitService = {
    getAllHabits,
    saveHabit,
    deleteHabit,
    deleteAllHabits,
};

async function getAllHabits() {
    const habits = await getAllDocuments(collectionName);
    return habits.map(data => new Habit(data));
}

async function saveHabit(habit) {
    const savedHabit = await setDocument(collectionName, habit);
    return new Habit(savedHabit);
}

async function deleteHabit(habitId) {
    await deleteDocument(collectionName, habitId);
}

async function deleteAllHabits() {
    await deleteAllDocuments(collectionName);
}
