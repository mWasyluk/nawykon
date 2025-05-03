import { DailyReport } from '@models/reports/DailyReport';
import { reportsRepository } from './repository';

export const ReportsService = {
    getAll: async () => {
        const resultArray = await reportsRepository.getAll();
        return resultArray.map(data => new DailyReport(data));
    },
    save: async (dailyReport) => {
        const result = await reportsRepository.save(dailyReport);
        return new DailyReport(result);
    },
    deleteById: async (id) => {
        return await reportsRepository.deleteById(id);
    }
};
