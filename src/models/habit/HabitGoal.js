import { formatDate, validateTimestamp } from '@utils/dateUtil';

export class HabitGoal {
    static DEFAULT_REPETITIONS = 1;
    static DEFAULT_DAYS = [0, 1, 2, 3, 4];

    constructor({ repetitions, days, startDate }) {
        HabitGoal.validate({ repetitions, days, startDate });

        this.repetitions = repetitions;
        this.days = days;
        this.startDate = startDate ? formatDate(startDate, 'date') : formatDate(new Date(), 'date');
    }

    toHistoryRecord() {
        return {
            repetitions: this.repetitions,
            days: this.days,
            startDate: this.startDate,
            endDate: formatDate(new Date(), 'date')
        };
    }

    static validate(goal) {
        function validateGoalProps(g) {
            return HabitGoal.validateRepetitions(g.repetitions)
                && HabitGoal.validateDays(g.days)
                && HabitGoal.validateStartDate(g.startDate);
        }

        validateGoalProps(goal);

        goal.history?.forEach(g => {
            validateGoalProps(g);
        });
    }

    static validateRepetitions(repetitions) {
        if (!repetitions || !Number.isInteger(repetitions) || repetitions < 1 || repetitions > 99) {
            throw new Error('Ilość powtórzeń musi się mieścić w 1-99.');
        }
        return true;
    }

    static validateDays(days) {
        if (!days || !Array.isArray(days) || days.length === 0) {
            throw new Error('Cel musi zawierać co najmniej jeden dzień.');
        }
        return true;
    }

    static validateStartDate(startDate) {
        if (!startDate) {
            return true;
        }
        try {
            validateTimestamp(startDate);
        } catch (error) {
            throw new Error(`Data rozpoczęcia '${startDate}' ma nieprawidłowy format.`);
        }

        return true;
    }
}




