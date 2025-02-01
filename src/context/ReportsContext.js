import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import db from 'src/configs/firebaseConfig';
import { HabitReport } from '../models/reports/HabitReport';
import { MoodReport } from '../models/reports/MoodReport';

const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
    const [habitReports, setHabitReports] = useState([]);
    const [habitReportsHistory, setHabitReportsHistory] = useState([]);
    const [moodReport, setMoodReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHabitReportsByDateRange = useCallback(async (habitId, startDate, endDate) => {
        const [startTimestamp, endTimestamp] = getTimestampRangeByDateRange(startDate, endDate);

        const habitQuery = query(
            collection(db, 'habitReports'),
            where('date', '>=', startTimestamp),
            where('date', '<=', endTimestamp),
            // habitId ? where('habitId', '==', habitId) : undefined
        );

        const habitSnapshot = await getDocs(habitQuery);
        const reports = habitSnapshot.docs.map(doc => new HabitReport({ ...doc.data() }));
        return reports;
    }, []);

    const fetchMoodReportByDate = useCallback(async (date) => {
        const [startTimestamp, endTimestamp] = getTimestampRangeByDateRange(date, date);

        const moodQuery = query(
            collection(db, 'moodReports'),
            where('timestamp', '>=', startTimestamp),
            where('timestamp', '<=', endTimestamp)
        );

        const moodSnapshot = await getDocs(moodQuery);
        if (!moodSnapshot.empty) {
            const moodData = moodSnapshot.docs[0].data();

            return new MoodReport(moodData);
        }
        return null;
    }, []);

    // get timestamp range for the beginning and the end of the current day
    const getTimestampRangeByDateRange = (startDate = new Date(), endDate = new Date()) => {
        const startDay = new Date(startDate);
        startDay.setHours(0, 0, 0, 0);
        const endDay = new Date(endDate);
        endDay.setHours(23, 59, 59, 999);
        return [startDay.toISOString(), endDay.toISOString()];
    };

    // fetch mood report and habit reports for today
    useEffect(() => {
        const fetchTodayReports = async () => {
            const todaysDate = new Date();
            try {
                setMoodReport(await fetchMoodReportByDate(todaysDate));
                setHabitReports(await fetchHabitReportsByDateRange(null, todaysDate, todaysDate));
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            };
        };

        if (isLoading) {
            fetchTodayReports();
        }
    }, [fetchHabitReportsByDateRange]);


    const addMoodReport = async (newMoodReport) => {
        const reportDocRef = doc(collection(db, 'moodReports'));
        const moodReportToSave = new MoodReport({ ...newMoodReport, id: reportDocRef.id });

        await setDoc(reportDocRef, JSON.parse(JSON.stringify(moodReportToSave)));
        setMoodReport(moodReportToSave);
    };

    const editMoodReport = async (moodReport) => {
        const reportDocRef = doc(db, 'moodReports', moodReport.id);
        const moodReportToSave = new MoodReport({ ...moodReport });

        await setDoc(reportDocRef, JSON.parse(JSON.stringify(moodReportToSave)));
        setMoodReport(moodReport);
    };

    const createHabitReports = async (habits = [], date = new Date()) => {
        try {
            const createdReports = await Promise.all(habits.map(async habit => {
                const reportDocRef = doc(collection(db, 'habitReports'));
                const habitReportToSave = HabitReport.fromHabit(habit, date);
                habitReportToSave.id = reportDocRef.id;
                await setDoc(reportDocRef, JSON.parse(JSON.stringify(habitReportToSave)));
                return habitReportToSave;
            }));

            setHabitReports(prevReports => [...prevReports, ...createdReports]);
        } catch (error) {
            setError(error);
        }
    };

    const deleteAllHabitReports = async () => {
        const reportsRef = collection(db, 'habitReports');
        const reportsSnapshot = await getDocs(reportsRef);

        reportsSnapshot.docs.forEach(async doc => {
            await deleteDoc(doc.ref);
        });

        setHabitReports([]);
    };

    const editHabitReport = async (habitReport) => {
        const reportDocRef = doc(db, 'habitReports', habitReport.id);
        const habitReportToSave = new HabitReport({ ...habitReport, updatedAt: new Date(), id: habitReport.id });

        habitReportsHistory.forEach(historyRecord => {
            const habitHistory = historyRecord.data.find(habitData => habitData.habitId === habitReportToSave.id);
            if (habitHistory) {
                updateReportsHistory(historyRecord.keyName, habitReportToSave);
            }
        });

        await setDoc(reportDocRef, JSON.parse(JSON.stringify(habitReportToSave)));
        setHabitReports([...habitReports.filter(report => report.id !== habitReport.id), habitReportToSave]);
    };

    const createHabitReportsHistory = async (keyName, habits, startDate, endDate = new Date()) => {
        setIsLoading(true);
        setError(null);

        if (!keyName || !habits || !startDate) {
            throw new Error('Key name, habits array (valid IDs) and start date are required to create history data.');
        }

        const recordByKey = habitReportsHistory.find(history => history.keyName === keyName);
        if (recordByKey) {
            throw new Error(`Habit reports history with the same key name (${keyName}) already exists.`);
        }

        const historyData = [];

        habits.forEach(habit => {
            const reports = fetchHabitReportsByDateRange(habit.id, startDate, endDate).catch(error => {
                setIsLoading(false);
                setError(error);
            });
            historyData.push({ habitId: habit.id, reports });
        });

        const historyRecord = { keyName, updatedAt: new Date(), data: historyData };

        setIsLoading(false);
        setHabitReportsHistory([habitReportsHistory, ...historyRecord]);
    }

    const updateReportsHistory = async (keyName, habitReport) => {
        const recordByKey = habitReportsHistory.find(history => history.keyName === keyName);
        if (!recordByKey) {
            throw new Error(`Habit reports history with the key name ${keyName} not found.`);
        }

        const historyData = recordByKey.data.map(habitData => {
            if (habitData.habitId === habitReport.habitId) {
                return {
                    habitId: habitData.habitId,
                    reports: [
                        ...habitData.reports.filter(report => report.id !== habitReport.id),
                        habitReport
                    ]
                };
            }
            return habitData;
        });

        const updatedRecord = {
            ...recordByKey,
            data: historyData,
            updatedAt: new Date()
        };
        setHabitReportsHistory([
            habitReportsHistory.filter(history => history.keyName !== keyName),
            updatedRecord
        ]);
    }

    return (
        <ReportsContext.Provider
            value={{
                habitReports,
                editHabitReport,
                createHabitReports,
                createHabitReportsHistory,
                deleteAllHabitReports,
                moodReport,
                addMoodReport,
                editMoodReport,
                fetchHabitReportsByDateRange,
                isLoading,
                error
            }}
        >
            {children}
        </ReportsContext.Provider>
    );
};

export const useReports = () => useContext(ReportsContext);
