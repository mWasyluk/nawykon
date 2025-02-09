import { Mood } from "@models/mood/Mood";
import { formatDate } from "@utils/dateUtil";

export class DailyReport {
    constructor({ id, uid, date, executions, mood }) {
        this.id = id || null;
        this.uid = uid || null;
        this.date = date ? formatDate(date, 'date') : formatDate(new Date(), 'date');

        this.executions = executions || {};
        this.mood = mood || null;
    }

    static fromHabitIds(habits, date = new Date()) {
        const executions = {};
        habits.forEach(habit => {
            executions[habit.id] = [];
        });
        return new DailyReport({ date, executions });
    }

    setHabitLog(id, executions = []) {
        if (!Array.isArray(executions)) {
            throw new Error('Executions must be an array of timestamps.');
        }
        if (executions.length === 0) {
            delete this.executions[id];
        } else {
            this.executions[id] = executions;
        }
    }

    setMood(mood) {
        this.mood = new Mood(mood);
    }
}
