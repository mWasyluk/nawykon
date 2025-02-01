import { daysOfWeek } from '@data/time';
import { validateTimestamp } from '@utils/dateUtil';

export class Goal {
    constructor({ timesPerDay, daysOfWeek, endDate }) {
        Goal.validate({ timesPerDay, daysOfWeek, endDate });

        this.timesPerDay = timesPerDay;
        this.daysOfWeek = daysOfWeek;
        this.endDate = endDate;
    }

    static validate(goal) {
        return Goal.validateTimesPerDay(goal.timesPerDay)
            && Goal.validateDaysOfWeek(goal.daysOfWeek)
            && Goal.validateEndDate(goal.endDate);
    }

    static validateTimesPerDay(timesPerDay) {
        if (!timesPerDay || !Number.isInteger(timesPerDay) || timesPerDay < 1 || timesPerDay > 99) {
            throw new Error('Wprowadź liczbę między 1-99.');
        }
        return true;
    }

    static validateDaysOfWeek(daysOfWeek) {
        if (!daysOfWeek || !Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
            throw new Error('Wybierz co najmniej jeden dzień.');
        }
        return true;
    }

    static validateEndDate(endDate) {
        if (!endDate) {
            return true;
        }
        try {
            validateTimestamp(endDate);
        } catch (error) {
            throw new Error('Wprowadź datę w formacie rrrr-mm-dd.');
        }

        return true;
    }
}

const defaultDaysOfWeek = [0, 1, 2, 3, 4];
export const defaultHabitGoalProps = {
    timesPerDay: 1,
    daysOfWeek: defaultDaysOfWeek,
    endDate: undefined
};



