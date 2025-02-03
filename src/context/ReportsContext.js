import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getHabitReportsByDateRange, getMoodReportByDate, addNewMoodReport, updateMoodReport, createNewHabitReports, removeAllHabitReports, updateHabitReport } from '@services/reportsService';

const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
    const [habitReports, setHabitReports] = useState([]);
    const [moodReport, setMoodReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHabitReports = useCallback(async (startDate, endDate, habitId = null) => {
        try {
            const reports = await getHabitReportsByDateRange(startDate, endDate, habitId);
            setHabitReports(reports);
        } catch (error) {
            setError(error);
        }
    }, []);

    const fetchMoodReport = useCallback(async (date) => {
        try {
            const report = await getMoodReportByDate(date);
            setMoodReport(report);
        } catch (error) {
            setError(error);
        }
    }, []);


    const addMoodReport = async (newMoodReport) => {
        try {
            const savedReport = await addNewMoodReport(newMoodReport);
            setMoodReport(savedReport);
        } catch (error) {
            setError(error);
        }
    };

    const editMoodReport = async (moodReport) => {
        try {
            const updatedReport = await updateMoodReport(moodReport);
            setMoodReport(updatedReport);
        } catch (error) {
            setError(error);
        }
    };

    const createHabitReports = async (habits = [], date = new Date()) => {
        try {
            const createdReports = await createNewHabitReports(habits, date);
            setHabitReports(prevReports => [...prevReports, ...createdReports]);
        } catch (error) {
            setError(error);
        }
    };

    const deleteAllHabitReports = async () => {
        try {
            await removeAllHabitReports();
            setHabitReports([]);
        } catch (error) {
            setError(error);
        }
    };

    const editHabitReport = async (habitReport) => {
        try {
            const updatedReport = await updateHabitReport(habitReport);
            setHabitReports([...habitReports.filter(report => report.id !== habitReport.id), updatedReport]);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        const fetchTodayReports = async () => {
            const todaysDate = new Date();

            await fetchMoodReport(todaysDate);
            await fetchHabitReports(todaysDate, todaysDate);

            setIsLoading(false);
        };

        if (isLoading) {
            fetchTodayReports();
        }
    }, [fetchHabitReports, fetchMoodReport]);

    return (
        <ReportsContext.Provider
            value={{
                habitReports,
                editHabitReport,
                createHabitReports,
                deleteAllHabitReports,
                moodReport,
                addMoodReport,
                editMoodReport,
                isLoading,
                error
            }}
        >
            {children}
        </ReportsContext.Provider>
    );
};

export const useReports = () => useContext(ReportsContext);
