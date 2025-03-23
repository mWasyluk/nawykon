import { ActivityUtil } from "@utils/activityUtil";
import { formatDate } from "@utils/dateUtil";

export class ActivityRegistry {
    static STATUSES = {
        COMPLETED: 'completed',
        FAILED: 'failed',
        PARTIAL: 'partial',
        NEUTRAL: 'neutral',
    };

    constructor(dailyReports = [], habits = []) {
        // Find the oldest date from daily reports (first user's activity)
        this.startDate = dailyReports.reduce((oldest, report) => {
            const reportDate = report.date;
            return reportDate < oldest ? reportDate : oldest;
        }, formatDate(new Date(), 'date'));

        this.records = {};
        // Initialize records for each day from the oldest date to today
        const today = formatDate(new Date(), 'date');
        for (let date = new Date(this.startDate); formatDate(date, 'date') <= today; date.setDate(date.getDate() + 1)) {
            this.records[formatDate(date, 'date')] = { mood: null, executions: {}, habits: {} };
        }

        // Update records with available data from daily reports
        dailyReports.forEach((dailyReport) => {
            this.records[dailyReport.date].mood = dailyReport.mood;
            this.records[dailyReport.date].executions = dailyReport.executions;
        });

        // Update every present record with available data from habits
        habits.forEach((habit) => {
            Object.keys(this.records).forEach((date) => {
                const goal = habit.getGoalForDate(date);
                // Skip if habit was not active on the given date
                if (goal === null) return;

                const executions = this.records[date].executions[habit.id] || [];

                this.records[date].habits[habit.id] = this.#calculateRecord(goal, executions);
            });
        });
    }

    clone() {
        const clone = new ActivityRegistry();
        clone.startDate = this.startDate;
        clone.records = this.records;
        return clone;
    }

    #calculateRecord = (goal, executions) => {
        if ((!goal && goal !== 0) || !executions) {
            throw new Error("Cannot generate a record without habit's goal and executions.");
        }

        const completed = executions.length;
        const status = ActivityUtil.calculateHabitStatus(goal, completed);

        return {
            executions,
            goal,
            completed,
            status,
        };
    }

    getRecord(date) {
        const dateKey = formatDate(date, 'date');
        const dateRecord = this.records[dateKey];

        const recordDto = {
            date: dateKey,
            mood: dateRecord?.mood,
            habits: dateRecord?.habits // { habitId: { goal, completed, status } }
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

    update = (dailyReports = [], habits = []) => {
        let isUpdated = false;
        dailyReports.forEach((dailyReport) => {
            if (!this.records[dailyReport.date]) {
                this.records[dailyReport.date] = {};
                isUpdated = true;
            }

            // Update mood if present in daily report
            if (dailyReport.mood) {
                // If mood is not present in records - add it, otherwise update only if changed
                if (!this.records[dailyReport.date].mood) {
                    this.records[dailyReport.date].mood = dailyReport.mood;
                    isUpdated = true;
                } else {
                    const newHumor = dailyReport.mood.humor;
                    const newEnergy = dailyReport.mood.energy;
                    const newNote = dailyReport.mood.note;

                    const prevHumor = this.records[dailyReport.date].mood.humor;
                    const prevEnergy = this.records[dailyReport.date].mood.energy;
                    const prevNote = this.records[dailyReport.date].mood.note;

                    const isHumorChanged = prevHumor !== newHumor;
                    const isEnergyChanged = prevEnergy !== newEnergy;
                    const isNoteChanged = prevNote !== newNote;

                    if (isHumorChanged || isEnergyChanged || isNoteChanged) {
                        this.records[dailyReport.date].mood = { humor: newHumor, energy: newEnergy, note: newNote };
                        isUpdated = true;
                    }
                }
            }

            // Update habit records
            habits.forEach((habit) => {
                const newGoal = habit.getGoalForDate(dailyReport.date);
                // Skip if habit was not active on the given date
                if (newGoal === null) return;

                const newExecutions = dailyReport.executions[habit.id] || [];

                // If habit is not present in records - add it, otherwise update only if changed
                if (!this.records[dailyReport.date].habits[habit.id]) {
                    this.records[dailyReport.date].habits[habit.id] = this.#calculateRecord(newGoal, newExecutions);
                    isUpdated = true;
                } else {
                    const prevGoal = this.records[dailyReport.date].habits[habit.id].goal;
                    const prevExecutions = this.records[dailyReport.date].habits[habit.id].executions;

                    const isGoalChanged = prevGoal !== newGoal;
                    const isExecutionsChanged = prevExecutions?.length !== newExecutions?.length
                        || prevExecutions.some(execution => !newExecutions.includes(execution));

                    if (isGoalChanged || isExecutionsChanged) {
                        this.records[dailyReport.date].habits[habit.id] = this.#calculateRecord(newGoal, newExecutions);
                        isUpdated = true;
                    }
                }
            });
        });

        return isUpdated;
    }

    static NEUTRAL_HABIT_RECORD = {
        goal: 0,
        completed: 0,
        status: ActivityRegistry.STATUSES.NEUTRAL,
    };
}
