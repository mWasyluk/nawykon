import { Settings } from '@models/user/Settings';
import { settingsRepository } from './repository';
import { generateId } from '@utils/idUtil';

export const SettingsService = {
    get: async () => {
        const resultArr = await settingsRepository.getAll();
        return new Settings(resultArr[0] || { id: generateId() });
    },
    save: async (settings) => {
        const result = await settingsRepository.save(settings);
        return new Settings(result);
    },
}
