import { formatDate, getMonthName } from "@utils/dateUtil";

export class Statistics {
    static STATUSES = {
        COMPLETED: 'completed',
        FAILED: 'failed',
        PARTIAL: 'partial',
        NEUTRAL: 'neutral',
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

        this.points = 0;
        this.update(dailyReports, habits);
    }

    clone = () => {
        const c = new Statistics();
        c.map = { ...this.map };
        c.habits = { ...this.habits };
        return c;
    };

    update(dailyReports, habits = null) {
        const isEveryHabitValid = habits && habits.every(habit => 'id' in habit);
        if (!isEveryHabitValid) {
            throw new Error("Statistics require an array of Habit instances.");
        }
        const isEveryReportValid = dailyReports.every(report => 'date' in report && 'executions' in report);
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

        this.points = Object.entries(this.map).reduce((acc, [date, habits]) => {
            const habitsToDo = Object.values(this.habits).reduce((acc, habit) => habit.getGoalForDate(date) > 0 ? ++acc : acc, 0);
            let habitsDone = 0;

            Object.keys(this.habits).forEach((habitId) => {
                const currentHabitGoal = this.habits[habitId].getGoalForDate(date);
                const currentHabitExecutions = habits[habitId].length;
                if (currentHabitGoal > 0 && currentHabitExecutions >= currentHabitGoal) {
                    habitsDone++;
                };
            });

            if (habitsToDo > 0 && habitsDone >= habitsToDo) {
                acc++;
            }
            return acc;
        }, 0);
    }

    // if habitId is not provided, generate stats for all habits
    #generateDailyStats(date, habitId = undefined) {
        const dailyStats = {
            habitStats: {},
            goal: 0,
            completed: 0,
            status: Statistics.STATUSES.NEUTRAL,
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
        };

        startDate = formatDate(startDate, 'date');
        endDate = formatDate(endDate, 'date');

        for (let date = new Date(startDate); formatDate(date, 'date') <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = formatDate(date, 'date');
            stats.dailyStats[formattedDate] = this.#generateDailyStats(formattedDate, habitId);
        }

        stats.goal = Object.values(stats.dailyStats).reduce((acc, stat) => acc + (stat?.goal || 0), 0);
        stats.completed = Object.values(stats.dailyStats).reduce((acc, stat) => acc + (stat?.completed || 0), 0);
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

    #calculateStatus(goal, completed) {
        if (!goal) {
            return Statistics.STATUSES.NEUTRAL;
        }

        const progress = completed / goal;
        if (progress === 1) {
            return Statistics.STATUSES.COMPLETED;
        }
        if (progress === 0) {
            return Statistics.STATUSES.FAILED;
        }
        return Statistics.STATUSES.PARTIAL
    }

    #combineStatuses(statuses = []) {
        const isEmptyOrEveryNeutral = !statuses.length || statuses.every(status => status === Statistics.STATUSES.NEUTRAL);
        if (isEmptyOrEveryNeutral) {
            return Statistics.STATUSES.NEUTRAL;
        }
        const isEveryCompletedOrNeutral = statuses.every(status => status === Statistics.STATUSES.COMPLETED || status === Statistics.STATUSES.NEUTRAL);
        if (isEveryCompletedOrNeutral) {
            return Statistics.STATUSES.COMPLETED;
        }
        const isEveryFailedOrNeutral = statuses.every(status => status === Statistics.STATUSES.FAILED || status === Statistics.STATUSES.NEUTRAL);
        if (isEveryFailedOrNeutral) {
            return Statistics.STATUSES.FAILED;
        }

        return Statistics.STATUSES.PARTIAL;
    }
}
