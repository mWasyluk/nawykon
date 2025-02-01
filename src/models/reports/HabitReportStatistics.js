export const STATISTIC_STATUSES = {
    completed: 'completed',
    failed: 'failed',
    partial: 'partial',
    neutral: 'neutral',
};

export class HabitReportStatistics {
    constructor(habitReport) {
        this.date = habitReport.date;
        this.habitId = habitReport.habitId;
        this.goal = habitReport.goal;
        this.completed = habitReport.executions.length;
        this.executions = habitReport.executions;
        this.progress = this.#calculateProgress();
        this.effectiveness = this.#calculateEffectiveness();
        this.status = this.#calculateStatus();
    }

    #calculateProgress() {
        return this.goal ? this.completed - (this.goal - this.completed) : 0;
    }

    #calculateEffectiveness () {
        return this.goal ? this.completed / this.goal : 1;
    }

    #calculateStatus() {
        if (!this.goal) {
            return STATISTIC_STATUSES.neutral;
        } else if (this.completed >= this.goal) {
            return STATISTIC_STATUSES.completed;
        } else if (this.completed) {
            return STATISTIC_STATUSES.partial;
        } else {
            return STATISTIC_STATUSES.failed;
        }
    }
}
