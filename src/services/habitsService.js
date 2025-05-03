import { Habit } from '@models/habit/Habit';
import { habitsRepository } from './repository';

export const HabitsService = {
    getAll: async () => {
        const resultArray = await habitsRepository.getAll();
        return resultArray.map(data => new Habit(data));
    },
    save: async (habit) => {
        const result = await habitsRepository.save(habit);
        return new Habit(result);
    },
    deleteById: async (habitId) => {
        return await habitsRepository.deleteById(habitId);
    }
};
