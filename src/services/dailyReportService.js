import { DailyReport } from '@models/reports/DailyReport';
import { deleteAllDocuments, deleteDocument, getAllDocuments, getAllDocumentsByQuery, setDocument } from '@services/firestoreService';
import { formatDate } from '@utils/dateUtil';
import { where } from 'firebase/firestore';

const collectionName = 'dailyReports';

export const DailyReportService = {
    getDailyReportByDate,
    getAllDailyReports,
    getAllDailyReportsByDateRange,
    saveDailyReport,
    deleteAllDailyReports,
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

    // remove empty daily reports from the database
    if (dailyReport.isEmpty()) {
        if (dailyReport.id) {
            await deleteDocument(collectionName, dailyReport.id);
        }
        return dailyReport;
    } else {
        const savedReport = await setDocument(collectionName, dailyReport);
        return new DailyReport(savedReport);
    }
}

async function deleteAllDailyReports() {
    await deleteAllDocuments(collectionName);
}
