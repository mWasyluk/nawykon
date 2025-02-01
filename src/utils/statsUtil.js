import { months } from "@data/time";
import { formatDate } from "./dateUtil";
import { STATISTIC_STATUSES } from "@models/reports/HabitReportStatistics";

export function generateActivityData(planStatsArray = []) {
    const monthIndex = {};
    return planStatsArray.reduce((acc, habitReportStats) => {
        const monthName = months[habitReportStats.date.getMonth()];
        const data = { habitId: habitReportStats.habitId, date: formatDate(habitReportStats.date), status: habitReportStats.status, executions: habitReportStats.executions };
        if (!monthIndex[monthName]) {
            const firstDayOfWeek = habitReportStats.date.getDay();
            monthIndex[monthName] = { period: monthName, firstDayOfWeek, data: [] };
            acc.push(monthIndex[monthName]);
        }
        monthIndex[monthName].data.push(data);
        return acc;
    }, []);
}
// example return:
// [
//     {
//         period: 'Styczeń',
//         firstDayOfWeek: 0,
//         data: [
//             { date: '2024-01-01', status: 'completed' },
//             { date: '2024-01-02', status: 'failed' },
//             ...
//         ]
//     },
//     {
//         period: 'Luty',
//         firstDayOfWeek: 3,
//         data: [
//             ...  
//         ]
//     },
//     ...
// ]

export function generateProgressData(planStatsArray = []) {
    const todaysDate = new Date();
    const todaysDateFormated = formatDate(todaysDate, 'date');

    const monthAgoDateFormated = formatDate(new Date(new Date().setDate(todaysDate.getDate() - 30)));
    const monthlyPlanStats = planStatsArray.filter((planStats) =>
        formatDate(planStats.date, 'date') >= monthAgoDateFormated
        && formatDate(planStats.date, 'date') <= todaysDateFormated
    )
    const monthData = {
        period: 'Miesiąc',
        chartData: prepareChartData(monthlyPlanStats),
        effectiveness: calculateEffectiveness(monthlyPlanStats),
        completed: calculateCompleted(monthlyPlanStats),
        failed: calculateFailed(monthlyPlanStats),
        longestStreak: calculateLongestStreak(monthlyPlanStats)
    };

    const weekAgoDateFormated = formatDate(new Date(new Date().setDate(todaysDate.getDate() - 7)));
    const weeklyPlanStats = planStatsArray.filter((planStats) =>
        formatDate(planStats.date, 'date') >= weekAgoDateFormated
        && formatDate(planStats.date, 'date') <= todaysDateFormated
    );
    const weekData = {
        period: 'Tydzień',
        chartData: prepareChartData(weeklyPlanStats),
        effectiveness: calculateEffectiveness(weeklyPlanStats),
        completed: calculateCompleted(weeklyPlanStats),
        failed: calculateFailed(weeklyPlanStats),
        longestStreak: calculateLongestStreak(weeklyPlanStats)
    };

    const lastHour = new Date().getHours() + 1 || 24;
    const yesterdaysData = [];
    const todaysData = [];
    for (let i = 0; i <= 8; i++) {
        const nextHour = lastHour - i * 3;
        if (nextHour <= 0) {
            yesterdaysData.push({ x: ((nextHour + 24) % 24) || 24, y: 0 });
        } else {
            todaysData.push({ x: nextHour, y: 0 });
        }
    }

    const yesterdaysDateFormated = formatDate(new Date(new Date().setDate(todaysDate.getDate() - 1)));

    const yesterdaysPlanStats = planStatsArray.filter((planStats) =>
        formatDate(planStats.date, 'date') === yesterdaysDateFormated
    )[0];
    yesterdaysPlanStats.executions.forEach((execution) => {
        const hour = new Date(execution.timestamp).getHours() + 1;
        yesterdaysData.filter((data) => data.x >= hour)[0].y++;
    });

    const todaysPlanStats = planStatsArray.filter((planStats) =>
        formatDate(planStats.date, 'date') === todaysDateFormated
    )[0];
    todaysPlanStats.executions.forEach((execution) => {
        const hour = new Date(execution.timestamp).getHours() + 1;
        todaysData.filter((data) => data.x >= hour)[0].y++;
    });

    const dayData = {
        period: 'Dzień',
        chartData: [...yesterdaysData, ...todaysData],
        effectiveness: calculateEffectiveness([todaysPlanStats, yesterdaysPlanStats]),
        completed: calculateCompleted([todaysPlanStats, yesterdaysPlanStats]),
        failed: calculateFailed([todaysPlanStats, yesterdaysPlanStats]),
        longestStreak: calculateLongestStreak([todaysPlanStats, yesterdaysPlanStats])
    };

    return [monthData, weekData, dayData];
}
// example return:
// [
//     {
//         period: 'Miesiąc',
//         chartData: [
//             { x: '01', y: 0 },
//             { x: '02', y: 1 },
//             ...
//         ],
//         effectiveness: 0.7,
//         completed: 21,
//         failed: 3,
//         longestStreak: 5
//     },
//     {
//         period: 'Tydzień',
//         chartData: [
//             ...
//         ],
//         effectiveness: 0.8,
//         ...
//     },
//     {
//         period: 'Dzień',
//         chartData: [
//             ...
//         ],
//         effectiveness: 0.9,
//         ...
//     }
// ]


const calculateEffectiveness = (planStatsArray = []) => {
    return planStatsArray.reduce((acc, planStats) => {
        return acc + planStats.effectiveness;
    }, 0) / planStatsArray.length;
}

const calculateCompleted = (planStatsArray = []) => {
    return planStatsArray.reduce((acc, planStats) => {
        return acc + planStats.completed;
    }, 0);
}

const calculateFailed = (planStatsArray = []) => {
    return planStatsArray.reduce((acc, planStats) => {
        return acc + (planStats.status === 'failed');
    }, 0);
}

const calculateLongestStreak = (planStatsArray = []) => {
    let longestStreak = 0;
    let currentStreak = 0;
    planStatsArray.forEach((planStats) => {
        if (planStats.status === STATISTIC_STATUSES.completed) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else if (planStats.status !== STATISTIC_STATUSES.neutral) {
            currentStreak = 0;
        }
    });
    return longestStreak;
}

const prepareChartData = (planStatsArray = []) => {
    return planStatsArray.map((planStats) => {
        const date = formatDate(planStats.date);
        const day = date.substring(8, 10);
        const progress = planStats.progress;

        return { x: day, y: progress };
    });
}
