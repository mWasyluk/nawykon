import { Habit } from "@models/habit/Habit";
import { DailyReport } from "./DailyReport";
import { formatDate, getMonthName } from "@utils/dateUtil";

export class Statistics {
    static STATUSES = {
        completed: 'completed',
        failed: 'failed',
        partial: 'partial',
        neutral: 'neutral',
    };

    constructor(dailyReports = [], habits = []) {
        this.map = {
            // "2022-01-01": {
            //      "habit_id": [
            //          1738963686502,
            //          1738963682332,
            //      ] 
            // }
        };
        this.habits = {};

        this.update(dailyReports, habits);
    }

    clone = () => {
        const c = new Statistics();
        c.map = { ...this.map };
        c.habits = { ...this.habits };
        return c;
    };

    update(dailyReports, habits = null) {
        const isEveryHabitValid = habits && habits.every(habit => habit instanceof Habit);
        if (!isEveryHabitValid) {
            throw new Error("Statistics require an array of Habit instances.");
        }
        const isEveryReportValid = dailyReports.every(report => report instanceof DailyReport);
        if (!isEveryReportValid) {
            throw new Error("Statistics require an array of DailyReport instances.");
        }

        if (habits) {
            habits.forEach((habit) => {
                this.habits[habit.id] = habit;
            });
        }


        dailyReports.forEach((dailyReport) => {
            if (!this.map[dailyReport.date]) {
                this.map[dailyReport.date] = {};
            }

            Object.values(this.habits).forEach((habit) => {
                const habitExecutions = dailyReport.executions[habit.id] || [];
                this.map[dailyReport.date][habit.id] = habitExecutions;
            });
        });
    }

    // if habitId is not provided, generate stats for all habits
    #generateDailyStats(date, habitId = undefined) {
        const dailyStats = {
            habitStats: {},
            goal: 0,
            completed: 0,
            status: Statistics.STATUSES.neutral,
        };

        const targetHabitIds = habitId ? [habitId] : [...Object.keys(this.habits)];
        if (!targetHabitIds.length) {
            return dailyStats;
        }

        const targetHabitsDailyStats = targetHabitIds.reduce((acc, habitId) => {
            if (!this.map[date] || !this.map[date][habitId]) {
                return acc;
            }

            const habit = this.habits[habitId];
            if (!habit) {
                console.warn("Habit", habitId, "is present in DailyReport for", date, "but not found in Statistics habits.");
                return acc;
            }
            const habitExecutions = this.map[date][habitId] || [];

            const logStat = {};
            logStat.executions = habitExecutions;
            logStat.goal = habit.getGoalForDate(date);
            logStat.completed = Math.min(logStat.executions.length, logStat.goal);
            logStat.status = this.#calculateStatus(logStat.goal, logStat.completed);

            acc[habitId] = logStat;
            return acc;
        }, {});

        dailyStats.habitStats = targetHabitsDailyStats;
        dailyStats.goal = Object.values(targetHabitsDailyStats).reduce((acc, stat) => acc + stat.goal, 0);
        dailyStats.completed = Object.values(targetHabitsDailyStats).reduce((acc, stat) => acc + stat.completed, 0);
        dailyStats.status = this.#combineStatuses(Object.values(targetHabitsDailyStats).map(stat => stat.status));

        return dailyStats;

    }

    getStatsByDateRange(startDate, endDate, habitId = undefined) {
        const stats = {
            dailyStats: {},
            goal: 0,
            completed: 0,
            status: Statistics.STATUSES.neutral,
        };

        startDate = formatDate(startDate, 'date');
        endDate = formatDate(endDate, 'date');

        for (let date = new Date(startDate); formatDate(date, 'date') <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = formatDate(date, 'date');
            stats.dailyStats[formattedDate] = this.#generateDailyStats(formattedDate, habitId);
        }

        stats.goal = Object.values(stats.dailyStats).reduce((acc, stat) => acc + (stat?.goal || 0), 0);
        stats.completed = Object.values(stats.dailyStats).reduce((acc, stat) => acc + (stat?.goal || 0), 0);
        stats.status = this.#combineStatuses(Object.values(stats.dailyStats).map(stat => stat?.status || Statistics.STATUSES.neutral));
        stats.habitIds = habitId ? [habitId] : Object.keys(this.habits);

        return stats;
    }

    getMonthlyStats(monthsLength, habitId = undefined) {
        const stats = {};

        for (let i = monthsLength - 1; i >= 0; i--) {
            const newDate = new Date(new Date().setMonth(new Date().getMonth() - i));
            const monthName = getMonthName(formatDate(newDate, 'date'));
            const firstDay = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
            const lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);

            stats[monthName] = this.getStatsByDateRange(firstDay, lastDay, habitId);
        }

        return stats;
    }

    #calculateStatus(goal, progress) {
        if (!goal) {
            return Statistics.STATUSES.neutral;
        }
        if (progress === 1) {
            return Statistics.STATUSES.completed;
        }
        if (progress === 0) {
            return Statistics.STATUSES.failed;
        }
        return Statistics.STATUSES.partial
    }

    #combineStatuses(statuses = []) {
        const isEveryNeutral = statuses.every(status => status === Statistics.STATUSES.neutral);
        if (isEveryNeutral) {
            return Statistics.STATUSES.neutral;
        }
        const isEveryCompleted = statuses.every(status => status === Statistics.STATUSES.completed);
        if (isEveryCompleted) {
            return Statistics.STATUSES.completed;
        }
        const isEveryNotCompleted = statuses.every(status => status !== Statistics.STATUSES.completed);
        if (isEveryNotCompleted) {
            return Statistics.STATUSES.failed;
        }

        return Statistics.STATUSES.partial;
    }
}
