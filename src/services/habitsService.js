import { Habit } from '@models/habit/Habit';
import { setDocument, getAllDocuments, deleteDocument } from '@services/firestoreService';

const collectionName = 'habits';

export async function getAllHabits() {
    const habits = await getAllDocuments(collectionName);
    return habits.map(data => new Habit(data));
}

export async function saveHabit(habit) {
    const savedHabit = await setDocument(collectionName, habit);
    return new Habit(savedHabit);
}

export async function deleteHabit(habitId) {
    await deleteDocument(collectionName, habitId);
}
