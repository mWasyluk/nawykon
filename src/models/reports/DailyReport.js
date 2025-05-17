import { Mood } from "@models/mood/Mood";
import { formatDate } from "@utils/dateUtil";

export class DailyReport {
    constructor({ id, date, executions, mood, modifiedAt }) {
        this.id = id || null;
        this.date = date ? formatDate(date, 'date') : formatDate(new Date(), 'date');
        this.modifiedAt = modifiedAt || new Date().getTime();

        this.executions = executions || {};
        this.mood = mood || null;
    }

    setHabitLog(id, executions = []) {
        if (!Array.isArray(executions)) {
            throw new Error('Executions must be an array of timestamps.');
        }
        this.executions[id] = executions;
        this.modifiedAt = new Date().getTime();
    }

    setMood(mood) {
        this.mood = new Mood(mood);
        this.modifiedAt = new Date().getTime();
    }
}
