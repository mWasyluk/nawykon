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
        const fileHandle = await window.showOpenFilePicker({
            types: [{
                accept: { 'application/json': ['.json'] },
            }],
        });

        const file = await fileHandle[0].getFile();
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
            const dumpData = reader.result;
            const obj = JSON.parse(dumpData);
            const keys = Object.keys(obj);
            for (const key of keys) {
                const data = obj[key];
                data.id = key.split('_')[1];

                repositories.forEach(async repository => {
                    if (key.startsWith(repository.keyPrefix)) {
                        await repository.save(data);
                    }
                });
            }
        };
    },

    clearAll: async () => {
        await Promise.all(repositories.map(repository => repository.deleteAll()));
    },

    exportDumpData: async () => {
        try {

            // Funkcja dostępna tylko w środowisku web
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
        } catch (error) {
            ModalService.showError('Zrzut danych nie został zapisany.');
        }
    }
}
