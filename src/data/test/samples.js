import { HabitReport } from "@models/reports/HabitReport";
import { formatDate } from "@utils/dateUtil";

function getRandomStatus() {
    const random = Math.random();
    if (random < 0.7) {
        return "completed";
    } else if (random < 0.85) {
        return "partial";
    } else if (random < 0.95) {
        return "failed";
    } else {
        return "neutral";
    }
}

function generateResult(startDay, endDay) {
    const obj = {};

    for (let i = startDay; i <= endDay; i++) {
        obj[i] = { status: getRandomStatus() };
    }

    return obj;
}

export function generateSampleActivityResults() {
    return {
        LIS: generateResult(1, 30),
        GRU: generateResult(1, 31),
        STY: generateResult(1, 12),
    };

}

export function generateDailyPlanArray(habit, startDate, endDate) {
    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];

    // Losowy dzień tygodnia dla pierwszego dnia
    let currentDayOfWeek = Math.floor(Math.random() * 7);

    // Konwersja dat na Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    const plans = [];

    let currentDate = new Date(start);

    while (currentDate <= end) {
        const dailyPlan = HabitReport.fromHabit(habit, currentDate);

        // Losowanie scenariusza wykonania nawyków
        const rand = Math.random();

        if (rand < 0.7) {
            Array.from({ length: habit.goal.timesPerDay }, () => (getRandomTimestamp(currentDate)))
                .forEach((timestamp) => dailyPlan.addExecution(timestamp));
        } else if (rand < 0.9) {
            // Tylko jeden nawyk wykonany
            const randomExecutionsNumber = Math.floor(Math.random() * habit.goal.timesPerDay + 1);
            for (let i = 0; i < randomExecutionsNumber; i++) {
                dailyPlan.addExecution(getRandomTimestamp(currentDate));
            }
        }

        plans.push(dailyPlan);

        currentDate.setDate(currentDate.getDate() + 1);
        currentDayOfWeek = (currentDayOfWeek + 1) % 7;
    }

    return plans;
}

function getRandomTimestamp(date) {
    let randomHour;
    if (formatDate(date) === formatDate(new Date())) {
        const currentHour = new Date().getHours();
        randomHour = Math.floor(Math.random() * (currentHour + 1));
    } else {
        randomHour = Math.floor(Math.random() * 24);
    }
    const randomMinute = Math.floor(Math.random() * 60);
    const randomSecond = Math.floor(Math.random() * 60);
    const randomMillisecond = Math.floor(Math.random() * 1000);

    const timestamp = new Date(date);
    timestamp.setHours(randomHour, randomMinute, randomSecond, randomMillisecond);

    return timestamp;
}
