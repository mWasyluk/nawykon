import { formatDate, getFixedDayOfWeek, validateTimestamp } from "./dateUtil";

export const ACTIVITY_STATUSES = {
    COMPLETED: 'completed',
    FAILED: 'failed',
    PARTIAL: 'partial',
    NEUTRAL: 'neutral',
};

export const ActivityUtil = {
    extractRecords: (activityRecords = [], startDate, endDate = new Date()) => {
        startDate = formatDate(startDate, 'date');
        endDate = formatDate(endDate, 'date');

        return activityRecords.filter((record) => {
            const recordDate = record.date;
            return recordDate >= startDate && recordDate <= endDate;
        });
    },

    calculateHabitStreak: (activityRegistry, habitId) => {
        if (!habitId) {
            return 0;
        }

        const startDate = new Date(activityRegistry.startDate);
        let streak = 0;
        for (let date = new Date(); date >= startDate; date.setDate(date.getDate() - 1)) {
            const record = activityRegistry.getRecord(formatDate(date, 'date'));
            if (!record.habits || !record.habits[habitId]) {
                continue; // No habit log for this date
            }

            const habitLog = record.habits[habitId];
            if (habitLog.status === ACTIVITY_STATUSES.COMPLETED) {
                streak += 1; // Completed status increases the streak
            } else if (habitLog.status === ACTIVITY_STATUSES.NEUTRAL) {
                continue; // Neutral status does not break the streak
            } else {
                break; // Streak is broken
            }
        }
        return streak;
    },

    calculateHabitStatus: (goal, completed) => {
        if (!goal) {
            return ACTIVITY_STATUSES.NEUTRAL;
        }

        const progress = completed / goal;
        if (progress >= 1) {
            return ACTIVITY_STATUSES.COMPLETED;
        }
        if (progress === 0) {
            return ACTIVITY_STATUSES.FAILED;
        }

        return ACTIVITY_STATUSES.PARTIAL
    },

    calculateHabitPoints: (activityRecords = [], habitId = undefined) => {
        // For each day...
        return activityRecords.reduce((points, record) => {
            // ... if there are no habits in the record, skip the day
            if (Object.keys(record.habits).length === 0) return points;

            // For each habit status in the record...
            Object.entries(record.habits).forEach(([id, { status }]) => {
                // ... if habitId is provided and it does not match the current habit, skip it
                if (habitId && habitId !== id) return;

                // ... calculate habit points and update the accumulated points
                points += calculatePointByStatus(status);
            });

            return points;
        }, 0);
    },

    calculateHabitStatistics: (activityRecords = [], habitId = undefined) => {
        // Default overall stats
        const totalStats = {
            completed: 0,
            partial: 0,
            failed: 0,
            streak: 0,
            points: 0,
            calendar: {
                // date: { goal: 0, completed: 0, effectual: 0, points: 0, status: STATUSES.NEUTRAL 
            },
        };

        // For each daily record in the activity records...
        totalStats.calendar = activityRecords.reduce((calendar, { date, habits }) => {
            const isRecordEmpty = !habits || Object.keys(habits).length === 0 || (habitId && !habits[habitId]);
            if (isRecordEmpty) {
                habits = {
                    [habitId]: {
                        executions: [],
                        goal: 0,
                        completed: 0,
                        effectual: 0,
                        status: ACTIVITY_STATUSES.NEUTRAL,
                    },
                };
            }

            const allStatuses = [];

            // ... for each habit in the record...
            Object.entries(habits).forEach(([id, { executions, goal, completed, effectual, status }]) => {
                // ... if the habitId is provided and it does not match the current habit, skip it
                if (habitId && habitId !== id) return;

                // ... if there is no entry for the given date, create one
                if (!calendar[date]) {
                    calendar[date] = {
                        goal: 0,
                        completed: 0,
                        points: 0,
                        effectual: 0,
                        status: ACTIVITY_STATUSES.NEUTRAL,
                    };
                }

                // ... update the daily stats
                calendar[date].executions = { ...calendar[date].executions, [id]: executions };
                calendar[date].goal += goal;
                calendar[date].completed += completed;
                calendar[date].effectual += effectual;

                // ... calculate habit points and update the daily stats
                calendar[date].points += calculatePointByStatus(status);

                allStatuses.push(status);
            });

            // ... update the total points based on the daily points
            totalStats.points += calendar[date].points;

            // ... combine statuses of all habits for the given day
            const status = combineStatuses(allStatuses);
            calendar[date].status = status;

            // ... update the overall stats based on the daily status
            switch (status) {
                case ACTIVITY_STATUSES.COMPLETED:
                    totalStats.completed += 1;
                    totalStats.streak += 1;
                    break;
                case ACTIVITY_STATUSES.PARTIAL:
                    totalStats.partial += 1;
                    totalStats.streak = 0;
                    break;
                case ACTIVITY_STATUSES.FAILED:
                    totalStats.failed += 1;
                    totalStats.streak = 0;
                    break;
            }

            return calendar;
        }, {});

        return totalStats;
    },

    calculateActionsSummary: (activityRegistry, habits = []) => {
        const summary = {
            actionsNumber: 0,
            habits: {
                startDate: undefined,
                totalNumber: 0,
                firstHabitExecutionsNumber: 0,
                // presentation
                firstHabit: undefined,
                firstHabitPoints: 0,
            },

            results: {
                weekAvgExecutionsNumber: 0,
                favHabitWeekAvgExecutionsNumber: 0,
                // presentation
                favHabit: undefined,
                favHabitPoints: 0,
            },

            mood: {
                weekAvgReportsNumber: 0,
                bestMoodDaysOfWeek: undefined,
                bestMoodDayOfPreviousWeek: undefined,
                // presentation
                bestMoodDayOfPreviousWeekReport: undefined,
            },

            notes: {
                weekAvgNotesNumber: 0,
                longestNoteLength: 0,
                // presentation
                longestNoteReport: undefined,
            },
        };

        const weeks = {};
        const totalExecutionsByHabitId = {};

        var adjustWeekNumber = false;
        const allRecords = activityRegistry.getRecords();
        allRecords.forEach((record, index) => {
            const dayOfWeek = getFixedDayOfWeek(record.date);
            // if the first record is not Monday, adjust all week numbers
            if (index === 0 && dayOfWeek > 0) {
                adjustWeekNumber = true;
            }
            const weekNumber = Math.floor((index - dayOfWeek) / 7) + (adjustWeekNumber ? 1 : 0);

            if (!weeks[weekNumber]) {
                weeks[weekNumber] = {
                    habits: {}, // { [habitId]: number }
                    executionsNumber: 0,
                    moodsNumber: 0,
                    notesNumber: 0,
                    bestHumor: undefined, // { humor: 0, moods: [] }
                };
            }

            // handle habits executions if any present
            if (record.habits) {
                Object.keys(record.habits).forEach((habitId) => {
                    const habitExecutionsNumber = record.habits[habitId]?.completed;

                    if (!weeks[weekNumber].habits[habitId]) {
                        weeks[weekNumber].habits[habitId] = 0;
                    }
                    weeks[weekNumber].executionsNumber += habitExecutionsNumber;
                    if (!totalExecutionsByHabitId[habitId]) {
                        totalExecutionsByHabitId[habitId] = habitExecutionsNumber;
                    } else {
                        totalExecutionsByHabitId[habitId] += habitExecutionsNumber;
                    }
                });
            }

            // handle mood report if present
            const dailyMood = record.mood;
            if (dailyMood) {
                dailyMood.date = record.date;
                weeks[weekNumber].moodsNumber += 1;

                // handle note if present
                if (dailyMood.note) {
                    weeks[weekNumber].notesNumber += 1;

                    // handle summary longest note
                    if (dailyMood.note.length > summary.notes.longestNoteLength) {
                        summary.notes.longestNoteReport = dailyMood;
                        summary.notes.longestNoteLength = dailyMood.note.length;
                    }
                }

                // handle best humor
                if (!weeks[weekNumber].bestHumor) {
                    // if no best humor yet set current mood as the best
                    weeks[weekNumber].bestHumor = { humor: dailyMood.humor, moods: [dailyMood] };
                } else if (dailyMood.humor > weeks[weekNumber].bestHumor.humor) {
                    // if current mood is better than the best so far, set it as the best
                    weeks[weekNumber].bestHumor = { humor: dailyMood.humor, moods: [dailyMood] };
                } else if (dailyMood.humor === weeks[weekNumber].bestHumor.humor) {
                    // if current mood is as good as the best so far, add it to the best moods
                    weeks[weekNumber].bestHumor.moods.push(dailyMood);
                }
            }
        });

        const weeksNumber = Object.keys(weeks).length;

        // habits summary
        summary.habits.totalNumber = habits.length;
        if (habits.length) {
            summary.habits.firstHabit = habits.reduce((firstHabit, habit) => {
                const habitCreatTime = habit.createdAt;
                return habitCreatTime < firstHabit.createdAt ? habit : firstHabit;
            }, habits[0]);
            summary.habits.startDate = formatDate(summary.habits.firstHabit.createdAt, 'date');
            summary.habits.firstHabitPoints = ActivityUtil.calculateHabitPoints(allRecords, summary.habits.firstHabit.id);
            summary.habits.firstHabitExecutionsNumber = totalExecutionsByHabitId[summary.habits.firstHabit.id];
        }

        // results summary
        const totalExecutionsNumber = Object.values(totalExecutionsByHabitId).reduce((sum, executions) => sum += executions, 0);
        summary.actionsNumber += totalExecutionsNumber;
        summary.results.weekAvgExecutionsNumber = totalExecutionsNumber / weeksNumber;

        var favHabitId = Object.keys(totalExecutionsByHabitId)[0];
        // find favorite habit based on the number of executions
        Object.entries(totalExecutionsByHabitId).forEach(([habitId, executions]) => {
            const currentMost = totalExecutionsByHabitId[favHabitId];
            if (executions > currentMost) {
                favHabitId = habitId;
            }
        });

        summary.results.favHabit = habits.find(habit => habit.id === favHabitId);
        summary.results.favHabitPoints = ActivityUtil.calculateHabitPoints(allRecords, favHabitId);

        const favHabitExecutionsNumber = totalExecutionsByHabitId[favHabitId];
        summary.results.favHabitWeekAvgExecutionsNumber = favHabitExecutionsNumber / weeksNumber;

        // mood summary
        const bestMoodByDayOfWeek = {};
        let bestMoodHighestReportsNumber = 0;

        Object.values(weeks).forEach(week => {
            week.bestHumor?.moods.forEach(mood => {
                const dayOfWeek = validateTimestamp(mood.date).getDay();
                if (!bestMoodByDayOfWeek[dayOfWeek]) {
                    bestMoodByDayOfWeek[dayOfWeek] = 1;
                } else {
                    bestMoodByDayOfWeek[dayOfWeek] += 1;
                }
                bestMoodHighestReportsNumber = Math.max(bestMoodHighestReportsNumber, bestMoodByDayOfWeek[dayOfWeek]);
            });
        });

        summary.mood.bestMoodDaysOfWeek = Object.entries(bestMoodByDayOfWeek)
            .reduce((bestDays, [dayOfWeek, bestMoodsNumber]) => {
                if (bestMoodsNumber === bestMoodHighestReportsNumber) {
                    bestDays.push((dayOfWeek + 6) % 7); // shift to start from Monday
                }
                return bestDays;
            }, []).sort();

        const totalMoodReportsNumber = Object.values(weeks).reduce((sum, week) => sum += week.moodsNumber, 0);
        summary.actionsNumber += totalMoodReportsNumber;
        summary.mood.weekAvgReportsNumber = totalMoodReportsNumber / weeksNumber;

        const previousWeek = weeks[weeksNumber - 2];
        if (previousWeek) {
            previousWeek.bestHumor?.moods.forEach(mood => {
                if (!summary.mood.bestMoodDayOfPreviousWeek) {
                    summary.mood.bestMoodDayOfPreviousWeekReport = mood;
                } else if (mood.humor >= summary.mood.bestMoodDayOfPreviousWeekReport.humor) {
                    summary.mood.bestMoodDayOfPreviousWeekReport = mood;
                }
            });

            if (summary.mood.bestMoodDayOfPreviousWeekReport) {
                const bestMoodPrevWeekDate = validateTimestamp(summary.mood.bestMoodDayOfPreviousWeekReport.date);
                summary.mood.bestMoodDayOfPreviousWeek = (bestMoodPrevWeekDate.getDay() + 6) % 7; // shift to start from Monday
            }
        }

        // notes summary
        const totalNotesNumber = Object.values(weeks).reduce((sum, week) => sum += week.notesNumber, 0);
        summary.notes.weekAvgNotesNumber = totalNotesNumber / weeksNumber;

        return summary;
    },

    calculateActionsNumber: (activityRecords = []) => {
        return activityRecords.reduce((sum, record) => {
            const allHabitLogs = Object.values(record.habits);
            Object.values(allHabitLogs).forEach(({ executions }) => {
                if (executions) {
                    sum += executions.length;
                }
            });
            if (record.mood) {
                sum += 1;
            }
            return sum;
        }, 0);
    },

    calculateAverageMoodsWeek: (activityRecords = []) => {
        const weekDays = [0, 1, 2, 3, 4, 5, 6];
        const moodByDayOfWeek = weekDays.reduce((acc, day) => {
            acc[day] = { totalMood: 0, reportsNumber: 0 };
            return acc;
        }, {});

        activityRecords.forEach(record => {
            const dailyMood = record.mood;
            if (dailyMood) {
                const dayOfWeek = getFixedDayOfWeek(record.date);
                moodByDayOfWeek[dayOfWeek].totalMood += dailyMood.humor;
                moodByDayOfWeek[dayOfWeek].reportsNumber += 1;
            }
        });

        return Object.entries(moodByDayOfWeek).map(([day, { totalMood, reportsNumber }]) => {
            return {
                day,
                avgMood: reportsNumber ? totalMood / reportsNumber : undefined,
            };
        });
    }
}

function calculatePointByStatus(status) {
    switch (status) {
        case ACTIVITY_STATUSES.COMPLETED:
            return 1;
        case ACTIVITY_STATUSES.FAILED:
            return -1;
        default:
            return 0;
    }
}

function combineStatuses(statuses = []) {
    const isEmptyOrEveryNeutral = !statuses.length || statuses.every(status => status === ACTIVITY_STATUSES.NEUTRAL);
    if (isEmptyOrEveryNeutral) {
        return ACTIVITY_STATUSES.NEUTRAL;
    }
    const isEveryCompletedOrNeutral = statuses.every(status => status === ACTIVITY_STATUSES.COMPLETED || status === ACTIVITY_STATUSES.NEUTRAL);
    if (isEveryCompletedOrNeutral) {
        return ACTIVITY_STATUSES.COMPLETED;
    }
    const isEveryFailedOrNeutral = statuses.every(status => status === ACTIVITY_STATUSES.FAILED || status === ACTIVITY_STATUSES.NEUTRAL);
    if (isEveryFailedOrNeutral) {
        return ACTIVITY_STATUSES.FAILED;
    }

    return ACTIVITY_STATUSES.PARTIAL;
}
