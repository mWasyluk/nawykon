import { Goal } from "@models/habit/Goal";
import { validateTimestamp } from "@utils/dateUtil";

export class HabitReport {
    constructor({ id, date, habitId, goal, executions, updatedAt }) {
        this.id = id;
        this.date = new Date(date);
        this.habitId = habitId;
        this.goal = goal;
        this.executions = executions || [];
        this.updatedAt = updatedAt || new Date();
    }

    static fromHabit(habit, date = new Date()) {
        const id = null;
        const habitId = habit.id;
        const goal = HabitReport.countDailyGoal(habit.goal, date);
        const executions = [];
        return new HabitReport({ date, habitId, goal, executions });
    }

    static countDailyGoal(habitGoal, date = new Date()) {
        const goal = habitGoal instanceof Goal ? habitGoal : new Goal(habitGoal);
        const dayOfWeek = date.getDay();

        if (goal.endDate && new Date(goal.endDate) < new Date(date)) {
            return 0;
        }
        if (!goal.daysOfWeek.includes(dayOfWeek)) {
            return 0;
        }

        return goal.timesPerDay;
    }

    updateHabit(habit) {
        if (this.habitId !== habit.id) {
            throw new Error(`Update is possible only with the habit object of the same id.`);
        }

        this.goal = HabitReport.countDailyGoal(habit.goal);
        this.updatedAt = new Date();
    }

    addExecution(timestamp = new Date()) {
        const validTimestamp = validateTimestamp(timestamp);
        this.executions.push({ timestamp: validTimestamp });
        this.updatedAt = new Date();
    }

    removeExecution(timestamp) {
        const index = this.executions.findIndex((execution) => validateTimestamp(execution.timestamp).getTime() === validateTimestamp(timestamp).getTime());
        if (index === -1) {
            throw new Error(`Execution with timestamp ${timestamp} not found.`);
        }
        this.executions.splice(index, 1);
        this.updatedAt = new Date();
    }
}
