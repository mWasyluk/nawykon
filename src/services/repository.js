import { generateId } from "@utils/idUtil";
import StorageService from "./storeService"

const COLLECTIONS = {
    HABIT: 'habit',
    REPORT: 'day',
    SETTINGS: 'settings',
}

class Repository {
    constructor(collection) {
        if (!collection || Object.values(COLLECTIONS).indexOf(collection) === -1) {
            throw new Error('Collection name is required and must be one of the predefined collections: '
                + Object.values(COLLECTIONS).join(', '));
        }

        this.keyPrefix = collection;
    }

    #extractIdFromKey = (key) => {
        if (!key) {
            throw new Error('Record\'s key is required to extract the object ID');
        }
        const id = key.substring(this.keyPrefix.length + 1);
        return id;
    }

    #generateKeyWithId = (id) => {
        if (!id) {
            throw new Error('ID is required to generate the key');
        }
        return `${this.keyPrefix}_${id}`;
    }

    getAll = async () => {
        const allKeys = await StorageService.getAllKeys(this.keyPrefix);
        const data = await Promise.all(allKeys.map(async key => {
            const data = await StorageService.getItem(key);
            const id = this.#extractIdFromKey(key);
            return data ? { ...data, id } : null;
        }));
        return data;
    }

    /**
        Throws an error if the ID is not provided.
    */
    getById = async (id) => {
        if (!id) {
            throw new Error('ID is required to get item from the repository');
        }
        const key = this.#generateKeyWithId(id);
        const data = await StorageService.getItem(key);
        return data ? { ...data, id } : null;
    }

    /**
        Throws an error if ID or data is not provided.
    */
    save = async (data) => {
        if (!data) {
            throw new Error('Data is required to set item in the repository');
        }
        const id = data.id || generateId();
        const key = this.#generateKeyWithId(id);
        delete data.id;
        await StorageService.setItem(key, data);
        data.id = id;
        return data;
    }

    /**
        Throws an error if ID is not provided.
    */
    deleteById = async (id) => {
        if (!id) {
            throw new Error('ID is required to remove item from the repository');
        }
        const key = this.#generateKeyWithId(id);
        await StorageService.removeItem(key);
        return true;
    }

    deleteAll = async () => {
        const allKeys = await StorageService.getAllKeys(this.keyPrefix);
        await Promise.all(allKeys.map(async key => {
            await StorageService.removeItem(key);
        }));
        return true;
    }
}

class HabitsRepository extends Repository {
    constructor() {
        super(COLLECTIONS.HABIT);
    }
}

class ReportsRepository extends Repository {
    constructor() {
        super(COLLECTIONS.REPORT);
    }
}

class SettingsRepository extends Repository {
    constructor() {
        super(COLLECTIONS.SETTINGS);
    }
}

export const habitsRepository = new HabitsRepository();

export const reportsRepository = new ReportsRepository();

export const settingsRepository = new SettingsRepository();
