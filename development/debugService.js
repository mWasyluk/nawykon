import { ModalService } from "@services/modalService";
import { habitsRepository, reportsRepository, settingsRepository } from "@services/repository";
import { formatDate } from "@utils/dateUtil";
import { Alert, Platform } from "react-native";

const DEFAULT_DUMP_DATA_FILENAME = 'dump_2025-05-03.json';
const DEFAULT_DUMP_DATA = require(`development/${DEFAULT_DUMP_DATA_FILENAME}`);

const repositories = [
    habitsRepository,
    reportsRepository,
    settingsRepository,
]

const saveDataToRepositories = async (obj) => {
    const keys = Object.keys(obj);

    for (const key of keys) {
        const data = obj[key];
        data.id = key.split('_')[1];

        for (const repository of repositories) {
            if (key.startsWith(repository.keyPrefix)) {
                await repository.save(data);
            }
        }
    }
}

export const DebugService = {
    importDumpData: async () => {
        try {
            let data;
            if (Platform.OS === 'web') {
                const [fileHandle] = await window.showOpenFilePicker({
                    types: [{
                        accept: { 'application/json': ['.json'] },
                    }],
                });

                const file = await fileHandle.getFile();
                const dumpData = await file.text();
                data = JSON.parse(dumpData);
            } else {
                const AsyncAlert = async () => new Promise((resolve) => {
                    Alert.alert(
                        'Ograniczony import danych',
                        `Import danych z dowolnego źródła nie jest możliwy na tym urządzeniu. Czy chcesz zaimportować dane z pliku ${DEFAULT_DUMP_DATA_FILENAME}?`,
                        [
                            { text: 'cancel', style: 'cancel', onPress: () => { resolve(false) } },
                            { text: 'ok', onPress: () => { resolve(true) } }
                        ],
                    );
                });

                const confirm = await AsyncAlert();
                if (!confirm) {
                    return false;
                }
                data = DEFAULT_DUMP_DATA;
            }

            await saveDataToRepositories(data);
            return true;
        } catch (error) {
            console.error("Error importing dump data:", error.message);
            ModalService.showError('Wczytywanie zrzutu danych nie powiodło się.');
        }
        return false;
    },

    clearAll: async () => {
        try {
            await Promise.all(repositories.map(repository => repository.deleteAll()));
            return true;
        } catch (error) {
            console.error("Error clearing all data:", error.message);
            ModalService.showError('Usuwanie wszystkich danych nie powiodło się.');
        }
        return false;
    },

    exportDumpData: async () => {
        try {
            if (Platform.OS === 'web') {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: `dump_${formatDate(new Date(), 'date')}.json`,
                    types: [{
                        accept: { 'application/json': ['.json'] },
                    }],
                });

                const file = await fileHandle.getFile();
                const filename = file.name;
                const writable = await fileHandle.createWritable();


                const dataDump = await repositories.reduce(async (accPromise, repository) => {
                    const acc = await accPromise;
                    const allDataArray = await repository.getAll();
                    const repoDump = allDataArray.reduce((tmpRepoDump, item) => {
                        const key = `${repository.keyPrefix}_${item.id}`;
                        delete item.id;
                        tmpRepoDump[key] = item;
                        return tmpRepoDump;
                    }, {});
                    return { ...acc, ...repoDump };
                }, Promise.resolve({}));

                await writable.write(JSON.stringify(dataDump, null, 2));
                await writable.close();

                ModalService.showError(`Zrzut danych zapisany w pliku ${filename}.`);
                return true;
            } else {
                Alert.alert("Eksport danych niedostępny", "Eksport danych jest dostępny tylko w wersji webowej. Użyj przeglądarki, aby wyeksportować dane.")
            }
        } catch (error) {
            console.error("Error exporting dump data:", error.message);
            ModalService.showError('Zrzut danych nie został zapisany.');
        }
        return false;
    },

    runBenchmark: (title, testFunction, iterations = 1) => {
        const times = [];

        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now();
            testFunction();
            const endTime = performance.now();

            times.push(endTime - startTime);
        }

        const totalTime = times.reduce((sum, time) => sum + time, 0);
        const minTime = Math.min(...times);
        const avgTime = totalTime / times.length;
        const maxTime = Math.max(...times);

        console.log(`%c${title} benchmark {${iterations} iterations} => ` +
            `minTime: ${minTime.toFixed(3)}ms, ` +
            `avgTime: ${avgTime.toFixed(3)}ms, ` +
            `maxTime: ${maxTime.toFixed(3)}ms`,
            'color: darkseagreen;',
        );
    }
}
