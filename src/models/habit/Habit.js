import { Goal } from './Goal';
import { HabitDetails } from './HabitDetails';

export class Habit {
    static VALID_STATUSES = ['active', 'completed'];

    constructor({ id, userId, details, goal, reminders }) {
        // if (streak && (typeof streak !== 'number' || streak < 0)) {
        //     throw new Error('Streak must be a non-negative number');
        // }

        this.id = id || null;
        this.userId = userId || null;
        this.details = details instanceof HabitDetails ? details : new HabitDetails({ ...details });
        this.goal = goal instanceof Goal ? goal : new Goal({ ...goal });
        this.status = this.goal.endDate && new Date(this.goal.endDate) < new Date() ? 'completed' : 'active';
        this.reminders = Array.isArray(reminders) ? reminders : [];
        this.streak = 0;
    }
}
