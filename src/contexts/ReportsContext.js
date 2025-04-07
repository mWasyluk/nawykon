import { DailyReport } from '@models/reports/DailyReport';
import { DailyReportService } from '@services/dailyReportService';
import { ModalService } from '@services/modalService';
import { formatDate } from '@utils/dateUtil';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useUser } from './UserContext';

const DailyReportsContext = createContext();

export const DailyReportsProvider = ({ children }) => {
    const { user } = useUser();

    const [dailyReports, setDailyReports] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const todaysReport = useMemo(() => {
        if (!dailyReports || dailyReports.length === 0) {
            return undefined;
        }
        return dailyReports.find(report => formatDate(report.date, 'date') === formatDate(new Date(), 'date'));
    }, [dailyReports]);

    const setMood = async (date, mood) => {
        setIsLoading(true);
        try {
            var isFound = false;
            const newReports = await Promise.all(dailyReports.map(async (report) => {
                if (report.date === date) {
                    isFound = true;
                    report.setMood(mood);
                    const saved = await DailyReportService.saveDailyReport(report);
                    return saved;
                }
                return report;
            }));

            if (!isFound) {
                const lackReport = new DailyReport({ date });
                lackReport.setMood(mood);
                const saved = await DailyReportService.saveDailyReport(lackReport);
                newReports.push(saved);
            }

            setDailyReports([...newReports]);
        } catch (error) {
            ModalService.showError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const setHabitLog = async (date, { id, executions }) => {
        setIsLoading(true);
        try {
            var isFound = false;
            const newReports = await Promise.all(dailyReports.map(async (report) => {
                if (report.date === date) {
                    isFound = true;
                    report.setHabitLog(id, executions);
                    const saved = await DailyReportService.saveDailyReport(report);
                    return saved;
                }
                return report;
            }));

            if (!isFound) {
                const lackReport = new DailyReport({ date });
                lackReport.setHabitLog(id, executions);
                const saved = await DailyReportService.saveDailyReport(lackReport);
                newReports.push(saved);
            }

            setDailyReports([...newReports]);
        } catch (error) {
            ModalService.showError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !user.uid) {
            return;
        }

        const initDailyReports = async () => {
            setIsLoading(true);
            try {
                // fetch all from database
                const reports = await DailyReportService.getAllDailyReports();

                // verify todays report and create or update if needed
                var todaysReport = reports.find(report => report.date === formatDate(new Date(), 'date'));
                if (!todaysReport) {
                    todaysReport = new DailyReport({ date: new Date() });
                    const saved = await DailyReportService.saveDailyReport(todaysReport);
                    reports.push(saved);
                }

                setDailyReports(reports);
            } catch (error) {
                ModalService.showError(error.message);
            } finally {
                setIsLoading(false);
            }
        };


        if (!dailyReports && !isLoading) {
            initDailyReports();
        }

        return () => {
            setDailyReports(null);
        };
    }, [user]);

    return (
        <DailyReportsContext.Provider
            value={{
                dailyReports,
                todaysReport,
                setHabitLog,
                setMood,
                isLoading,
            }}
        >
            {children}
        </DailyReportsContext.Provider>
    );
};

export const useReports = () => useContext(DailyReportsContext);
