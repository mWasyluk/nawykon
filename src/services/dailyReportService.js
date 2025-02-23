import { DailyReport } from '@models/reports/DailyReport';
import { getAllDocuments, getAllDocumentsByQuery, setDocument } from '@services/firestoreService';
import { formatDate } from '@utils/dateUtil';
import { where } from 'firebase/firestore';

const collectionName = 'dailyReports';

export const DailyReportService = {
    getDailyReportByDate,
    getAllDailyReports,
    getAllDailyReportsByDateRange,
    saveDailyReport,
};

async function getDailyReportByDate(date) {
    const fDate = formatDate(date, 'date');
    const reports = await getAllDocumentsByQuery(collectionName, [where('date', '==', fDate)]);
    return reports[0] ? new DailyReport(reports[0]) : null;
}

async function getAllDailyReportsByDateRange(startDate, endDate) {
    const start = formatDate(startDate, 'date');
    const end = formatDate(endDate, 'date');
    const reports = await getAllDocumentsByQuery(collectionName, [where('date', '>=', start), where('date', '<=', end)]);
    return reports.map(data => new DailyReport(data));
}

async function getAllDailyReports() {
    const reports = await getAllDocuments(collectionName);
    return reports.map(data => new DailyReport(data));
}

async function saveDailyReport(dailyReport) {
    if (!dailyReport.date) {
        throw new Error('Date is required to save a daily report');
    }

    const reportByDate = await getDailyReportByDate(dailyReport.date);
    if (reportByDate) {
        dailyReport.id = reportByDate.id;
    }

    // TODO: remove empty daily reports from the database
    // if (Object.keys(dailyReport.executions).length === 0 && dailyReport.mood === null) {
    //     await deleteDocument(collectionName, dailyReport.id);
    //     return null;
    // }

    const savedReport = await setDocument(collectionName, dailyReport);
    return new DailyReport(savedReport);
}
