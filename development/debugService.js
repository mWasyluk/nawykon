import { ModalService } from "@services/modalService";
import { habitsRepository, reportsRepository, settingsRepository } from "@services/repository";
import { formatDate } from "@utils/dateUtil";

const repositories = [
    habitsRepository,
    reportsRepository,
    settingsRepository,
]

export const DebugService = {
    importDumpData: async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    accept: { 'application/json': ['.json'] },
                }],
            });

            const file = await fileHandle.getFile();
            const dumpData = await file.text();
            const obj = JSON.parse(dumpData);
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
