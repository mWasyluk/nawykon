import { getDocumentsByQuery, addDocument, updateDocument, deleteAllDocuments } from '@web/databaseApi';
import { HabitReport } from '@models/reports/HabitReport';
import { MoodReport } from '@models/reports/MoodReport';
import { where } from 'firebase/firestore';

const getTimestampRangeByDateRange = (startDate = new Date(), endDate = new Date()) => {
    const startDay = new Date(startDate);
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date(endDate);
    endDay.setHours(23, 59, 59, 999);
    return [startDay.toISOString(), endDay.toISOString()];
};

export const getHabitReportsByDateRange = async (startDate, endDate, habitId = null) => {
    const [startTimestamp, endTimestamp] = getTimestampRangeByDateRange(startDate, endDate);
    const queryArgs = [
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp)
    ];

    if (habitId) {
        queryArgs.push(where('habitId', '==', habitId));
    }

    const reports = await getDocumentsByQuery('habitReports', queryArgs);
    return reports.map(data => new HabitReport(data));
};

export const getMoodReportByDate = async (date) => {
    const [startTimestamp, endTimestamp] = getTimestampRangeByDateRange(date, date);
    const queryArgs = [
        where('timestamp', '>=', startTimestamp),
        where('timestamp', '<=', endTimestamp)
    ];

    const reports = await getDocumentsByQuery('moodReports', queryArgs);
    if (reports.length > 0) {
        return new MoodReport(reports[0]);
    }
    return null;
};

export const addNewMoodReport = async (newMoodReport) => {
    const savedReport = await addDocument('moodReports', newMoodReport);
    return new MoodReport(savedReport);
};

export const updateMoodReport = async (moodReport) => {
    const updatedReport = await updateDocument('moodReports', moodReport.id, moodReport);
    return new MoodReport(updatedReport);
};

export const createNewHabitReports = async (habits, date) => {
    const createdReports = await Promise.all(habits.map(async habit => {
        const habitReportToSave = HabitReport.fromHabit(habit, date);
        const savedReport = await addDocument('habitReports', habitReportToSave);
        return new HabitReport(savedReport);
    }));
    return createdReports;
};

export const removeAllHabitReports = async () => {
    await deleteAllDocuments('habitReports');
};

export const updateHabitReport = async (habitReport) => {
    const updatedReport = await updateDocument('habitReports', habitReport.id, habitReport);
    return new HabitReport(updatedReport);
};
