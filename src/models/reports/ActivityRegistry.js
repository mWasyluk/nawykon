import { ActivityUtil } from "@utils/activityUtil";
import { ObjectUtil } from "@utils/objectUtil";
import { formatDate } from "@utils/dateUtil";

export class ActivityRegistry {
    constructor(dailyReports = [], habits = []) {
        this.startDate = formatDate(new Date(), 'date');
        this.records = {};
        this.habitIdsSet = new Set(habits.map(habit => habit.id));

        for (const report of dailyReports) {
            const dateKey = formatDate(report.date, 'date');
            this.#initRecord(dateKey);
            const dateRecord = this.records[dateKey];

            if (report.mood) {
                dateRecord.mood = { ...report.mood };
            }
            if (report.executions) {
                dateRecord.executions = { ...report.executions };
            }
        }

        for (let date = new Date(this.startDate); formatDate(date, 'date') <= formatDate(new Date(), 'date'); date.setDate(date.getDate() + 1)) {
            const dateKey = formatDate(date, 'date');
            this.#initRecord(dateKey);
            const dateRecord = this.records[dateKey];

            for (const habit of habits) {
                const habitId = habit.id;
                const goal = habit.getGoalForDate(dateKey);
                dateRecord.goals[habitId] = goal;
            }
        }

        this.modifiedAt = new Date().getTime();
    }

    clone() {
        const clone = new ActivityRegistry();
        clone.startDate = this.startDate;
        clone.records = this.records;
        clone.habitIdsSet = this.habitIdsSet;
        clone.modifiedAt = this.modifiedAt;
        return clone;
    }

    #getDefaultRecord = () => {
        return {
            mood: null,
            executions: {},
            goals: {},
        };
    }

    #initRecord = (date) => {
        let isUpdated = false;
        const dateKey = formatDate(date, 'date');

        if (!this.records[dateKey]) {
            if (this.startDate > dateKey) {
                this.startDate = dateKey;
                isUpdated = true;
            }
            this.records[dateKey] = this.#getDefaultRecord();
            isUpdated = true;
        }

        return isUpdated;
    }

    #calculateHabitSummary = (goal, executions) => {
        const completed = executions.length || 0;
        const status = ActivityUtil.calculateHabitStatus(goal, completed);
        const effectual = Math.min(completed, goal);

        return {
            executions,
            goal,
            completed,
            effectual,
            status,
        };
    }

    updateAllRecords = (dailyReports, habits) => {
        let isUpdated = false;

        for (const report of dailyReports) {
            const dateKey = formatDate(report.date, 'date');
            isUpdated = this.#initRecord(dateKey) || isUpdated;
            const dateRecord = this.records[dateKey];

            if (!ObjectUtil.areEqual(dateRecord.mood, report.mood)) {
                dateRecord.mood = { ...report.mood };
                isUpdated = true;
            }

            if (!ObjectUtil.areEqual(dateRecord.executions, report.executions)) {
                dateRecord.executions = { ...report.executions };
                isUpdated = true;
            }
        }

        for (const habit of habits) {
            const habitId = habit.id;

            const dateKey = formatDate(new Date(), 'date');
            const dateRecord = this.records[dateKey];

            const goal = habit.getGoalForDate(dateKey);
            if (dateRecord.goals[habitId] !== goal) {
                dateRecord.goals[habitId] = goal;
                isUpdated = true;
            }
            this.habitIdsSet.add(habitId);
        }

        if (isUpdated) {
            this.modifiedAt = new Date().getTime();
        }
        return isUpdated;
    }

    getHabitIds = () => {
        return Array.from(this.habitIdsSet);
    }

    removeHabitRecords = (habitId) => {
        if (!habitId) {
            throw new Error("HabitId is required to remove habit records in the ActivityRegistry.");
        }
        if (!this.habitIdsSet.has(habitId)) {
            console.warn(`Habit with id ${habitId} is not found in the ActivityRegistry.`);
            return false;
        }

        let isUpdated = false;

        for (const dateKey in this.records) {
            const dateRecord = this.records[dateKey];
            if (dateRecord.executions[habitId]) {
                delete dateRecord.executions[habitId];
                isUpdated = true;
            }
            if (dateRecord.goals[habitId]) {
                delete dateRecord.goals[habitId];
                isUpdated = true;
            }
        }

        if (isUpdated) {
            this.habitIdsSet.delete(habitId);
            this.modifiedAt = new Date().getTime();
        }
        return isUpdated;
    }

    #calculateAllHabitSummaries = (record) => {
        return Object.keys(record.goals).reduce((acc, habitId) => {
            const goal = record.goals[habitId];
            const executions = record.executions[habitId] || [];
            acc[habitId] = this.#calculateHabitSummary(goal, executions);
            return acc;
        }, {});
    }

    getRecord(date) {
        const dateKey = formatDate(date, 'date');
        const dateRecord = this.records[dateKey] || this.#getDefaultRecord();

        const recordDto = {
            date: dateKey,
            mood: dateRecord.mood,
            habits: this.#calculateAllHabitSummaries(dateRecord) // { habitId: { executions, goal, completed, effectual, status, } }
        };

        return recordDto;
    }

    getRecords(startDate = this.startDate, endDate = new Date()) {
        startDate = formatDate(startDate, 'date');
        endDate = formatDate(endDate, 'date');

        const records = [];

        for (let date = new Date(startDate); formatDate(date, 'date') <= endDate; date.setDate(date.getDate() + 1)) {
            const record = this.getRecord(date);
            if (!record) continue;

            records.push(record);
        }

        return records;
    }
}
