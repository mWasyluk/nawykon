import { formatDate, getFixedDayOfWeek, validateTimestamp } from '@utils/dateUtil';
import { HabitDetails } from './HabitDetails';
import { HabitGoal } from './HabitGoal';

export class Habit {
    static VALID_STATUSES = ['active', 'completed'];

    constructor({ id, uid, details, goal, goalHistory, reminders, startDate, endDate }) {
        this.id = id || null;
        this.uid = uid || null;
        this.details = details instanceof HabitDetails ? details : new HabitDetails({ ...details });
        this.goalHistory = Array.isArray(goalHistory) ? goalHistory : [];
        this.goal = goal instanceof HabitGoal ? goal : new HabitGoal({ ...goal });
        this.status = this.goal.endDate && new Date(this.goal.endDate) < new Date() ? 'completed' : 'active';
        this.reminders = Array.isArray(reminders) ? reminders : [];

        this.streak = 0; // TODO: Streak should be a part of stats instead of habit, but already used in the app

        this.startDate = startDate ? formatDate(startDate, 'date') : formatDate(new Date(), 'date');
        this.endDate = endDate ? formatDate(endDate, 'date') : null;
    }

    changeGoal({ repetitions, days }) {
        const newGoal = new HabitGoal({ repetitions, days, startDate: new Date() });

        if (formatDate(this.goal.startDate, 'date') !== formatDate(new Date(), 'date')) {
            const historyRecord = this.goal.toHistoryRecord();
            this.goalHistory.push(historyRecord);
        }

        this.goal = newGoal;
    }

    getGoalForDate(date) {
        if (this.startDate > formatDate(date, 'date')) {
            return 0;
        }

        const wasCurrentGoalActive = this.goal.startDate <= formatDate(date, 'date');
        if (!wasCurrentGoalActive) {
            const history = this.goalHistory.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            const firstMatchingGoal = history.find(record => record.startDate <= formatDate(date, 'date'));
            if (firstMatchingGoal) {
                const wasDayOfWeek = firstMatchingGoal.days.includes(getFixedDayOfWeek(date));
                return wasDayOfWeek ? firstMatchingGoal.repetitions : 0;
            }
        }

        const wasDayOfWeek = this.goal.days.includes(getFixedDayOfWeek(date));
        return wasDayOfWeek ? this.goal.repetitions : 0;
    }

    static validateReminders(reminders) {
        if (!reminders) {
            return true;
        }

        if (!Array.isArray(reminders) || !reminders.every(reminder => /^\d{2}:\d{2}$/.test(reminder))) {
            throw new Error('Godziny przypomnień muszą mieć format HH:MM.');
        }

        return true;
    }

    static validateEndDate(endDate) {
        if (!endDate) {
            return true;
        }

        var endDate;
        try {
            endDate = validateTimestamp(endDate);
        } catch (error) {
            throw new Error(`Data zakończenia ma nieprawidłowy format.`);
        }

        if (endDate < new Date()) {
            throw new Error('Data zakończenia nie może być wcześniejsza niż dzisiaj.');
        }

        return true;
    }
}

export class HabitBuilder {
    constructor(habit = null) {
        this.habit = habit;
        this.isError = false;
        this.setErrors = null;
    }

    // Validation support
    _validate(validationFn, value, propName) {
        try {
            validationFn(value);
            this.setErrors && this.setErrors(prev => prev.filter(prop => prop !== propName));
        } catch (error) {
            this.setErrors && this.setErrors(prev => [...prev.filter(prop => prop !== propName), propName]);
            throw error;
        }
    }

    // Details
    withName(name) {
        this.name = name;
        this._validate(HabitDetails.validateName, name, 'name');
        return this;
    }

    withDescription(description) {
        this.description = description;
        return this;
    }

    withType(type) {
        this.type = type;
        this._validate(HabitDetails.validateType, type, 'type');
        return this;
    }

    // Goal
    withRepetitions(repetitions) {
        this.repetitions = repetitions;
        this._validate(HabitGoal.validateRepetitions, repetitions, 'repetitions');
        return this;
    }

    withDays(days) {
        this.days = days;
        this._validate(HabitGoal.validateDays, days, 'days');
        return this;
    }

    withReminders(reminders) {
        this.reminders = reminders;
        this._validate(Habit.validateReminders, reminders, 'reminders');
        return this;
    }

    withEndDate(endDate) {
        this.endDate = endDate;
        this._validate(Habit.validateEndDate, endDate, 'endDate');
        return this;
    }

    build() {
        const setGoal = () => {
            const currentGoal = this.habit?.goal;

            const hasOwnRepetitions = this.hasOwnProperty('repetitions');
            const hasOwnDays = this.hasOwnProperty('days');
            var repetitions = hasOwnRepetitions ? this.repetitions : currentGoal?.repetitions;
            var days = hasOwnDays ? this.days : currentGoal?.days;

            if (this.habit) {
                this.habit.changeGoal({ repetitions, days });
            } else {
                this.goal = new HabitGoal({ repetitions, days });
            }
        }
        const setDetails = () => {
            const currentDetails = this.habit?.details;

            const hasOwnName = this.hasOwnProperty('name');
            const hasOwnType = this.hasOwnProperty('type');
            const hasOwnDescription = this.hasOwnProperty('description');
            var name = hasOwnName ? this.name : currentDetails?.name;
            var type = hasOwnType ? this.type : currentDetails?.type;
            var description = hasOwnDescription ? this.description : currentDetails?.description;

            if (currentDetails) {
                this.habit.details = new HabitDetails({ name, type, description });
            } else {
                this.details = new HabitDetails({ name, type, description });
            }
        }

        setGoal();
        setDetails();
        this.hasOwnProperty('endDate') && Habit.validateEndDate(this.endDate);

        if (this.habit) {
            return new Habit({ ...this.habit, ...this });
        }
        return new Habit({ ...this, details: this.details, goal: this.goal });
    }
}
