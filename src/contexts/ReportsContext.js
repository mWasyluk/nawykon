import { DailyReport } from '@models/reports/DailyReport';
import { ModalService } from '@services/modalService';
import { ReportsService } from '@services/reportsService';
import { formatDate } from '@utils/dateUtil';
import { createContext, useContext, useEffect, useState } from 'react';

const DailyReportsContext = createContext();

export const DailyReportsProvider = ({ children }) => {
    const [dailyReports, setDailyReports] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const setMood = async (date, mood) => {
        setIsLoading(true);
        if (date > formatDate(new Date(), 'date')) {
            ModalService.showError("Nie możesz dodać aktywności w przyszłości.");
            setIsLoading(false);
            return;
        }

        try {
            var isFound = false;
            const newReports = await Promise.all(dailyReports.map(async (report) => {
                if (report.date === date) {
                    isFound = true;
                    report.setMood(mood);
                    const saved = await ReportsService.save(report);
                    return saved;
                }
                return report;
            }));

            if (!isFound) {
                const lackReport = new DailyReport({ date });
                lackReport.setMood(mood);
                const saved = await ReportsService.save(lackReport);
                newReports.push(saved);
            }

            setDailyReports([...newReports]);
        } catch (error) {
            console.error(error);
            ModalService.showError("Nie udało się zapisać nastroju. Odśwież aplikację i spróbuj ponownie.");
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
                    const saved = await ReportsService.save(report);
                    return saved;
                }
                return report;
            }));

            if (!isFound) {
                const lackReport = new DailyReport({ date });
                lackReport.setHabitLog(id, executions);
                const saved = await ReportsService.save(lackReport);
                newReports.push(saved);
            }

            setDailyReports([...newReports]);
        } catch (error) {
            ModalService.showError("Nie udało się zapisać aktywności. Odśwież aplikację i spróbuj ponownie.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initDailyReports = async () => {
            setIsLoading(true);
            try {
                // fetch all from database
                const reports = await ReportsService.getAll();

                // verify todays report and create or update if needed
                var todaysReport = reports.find(report => report.date === formatDate(new Date(), 'date'));
                if (!todaysReport) {
                    todaysReport = new DailyReport({ date: new Date() });
                    const saved = await ReportsService.save(todaysReport);
                    reports.push(saved);
                }

                setDailyReports(reports);
            } catch (error) {
                console.error(error);
                ModalService.showError("Nie udało się pobrać raportów. Odśwież aplikację i spróbuj ponownie.");
            } finally {
                setIsLoading(false);
            }
        };


        initDailyReports();

        return () => {
            setDailyReports(null);
        };
    }, []);

    return (
        <DailyReportsContext.Provider
            value={{
                dailyReports,
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
