import { DailyReport } from '@models/reports/DailyReport';
import * as DailyReportService from '@services/reportService';
import { formatDate } from '@utils/dateUtil';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useUser } from './UserContext';

const DailyReportsContext = createContext();

export const DailyReportsProvider = ({ children }) => {
    const { user } = useUser();

    const [dailyReports, setDailyReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const todaysReport = useMemo(() => {
        if (!dailyReports || dailyReports.length === 0) {
            return undefined;
        }
        return dailyReports.find(report => formatDate(report.date, 'date') === formatDate(new Date(), 'date'));
    }, [dailyReports]);

    const saveDailyReport = async (report) => {
        await DailyReportService.saveDailyReport(report);
    };

    const setMood = async (date, mood) => {
        const newReports = dailyReports.map(report => {
            if (report.date === date) {
                report.setMood(mood);
                saveDailyReport(report);
            }
            return report;
        });

        setDailyReports([...newReports]);
    };

    const setHabitLog = async (date, { id, executions }) => {
        var updatedDailyReport = null;
        const updatedDailyReports = dailyReports.map(report => {
            if (report.date === date) {
                report.setHabitLog(id, executions);
                updatedDailyReport = report;
            }
            return report;
        });

        if (updatedDailyReport) {
            await saveDailyReport(updatedDailyReport);
        };

        setDailyReports([...updatedDailyReports]);
    };

    useEffect(() => {
        if (!user) {
            return;
        }

        const initDailyReports = async () => {
            try {
                // fetch all from database
                const reports = await DailyReportService.getAllDailyReports();

                // verify todays report and create or update if needed
                var todaysReport = reports.find(report => report.date === formatDate(new Date(), 'date'));
                if (!todaysReport) {
                    todaysReport = new DailyReport({ date: new Date() });
                    reports.push(todaysReport);
                    await saveDailyReport(todaysReport);
                }

                setDailyReports(reports);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };


        if (isLoading) {
            initDailyReports();
        }
    }, [user]);

    return (
        <DailyReportsContext.Provider
            value={{
                dailyReports,
                todaysReport,
                setHabitLog,
                setMood,
                isLoading,
                error
            }}
        >
            {children}
        </DailyReportsContext.Provider>
    );
};

export const useReports = () => useContext(DailyReportsContext);
