export class Mood {
    constructor({ humor, energy, note }) {
        Mood.validateHumor(humor);
        Mood.validateEnergy(energy);
        Mood.validateNote(note);

        this.humor = humor;
        this.energy = energy;
        this.note = note;
    }

    static validateHumor(humor) {
        if (humor !== 0 && !humor) {
            throw new Error('Humor jest wymagany do utworzenia raportu.');
        }

        if (typeof humor !== 'number' || humor < 0 || humor > 4) {
            throw new Error('Podaj wartość z zakresu 0-4.');
        }

        return true;
    }

    static validateEnergy(energy) {
        if (energy !== 0 && !energy) {
            throw new Error('Energia jest wymagana do utworzenia raportu.');
        }

        if (typeof energy !== 'number' || energy < 0 || energy > 2) {
            throw new Error('Podaj wartość z zakresu 0-2.');
        }

        return true;
    }

    static validateNote(note) {
        return true;
    }
}

export class MoodReportBuilder {
    constructor() {
        this.moodReport = {};
    }

    withHumor(humor) {
        Mood.validateHumor(humor);
        this.moodReport.humor = humor;
        return this;
    }

    withEnergy(energy) {
        Mood.validateEnergy(energy);
        this.moodReport.energy = energy;
        return this;
    }

    withNote(note) {
        Mood.validateNote(note);
        this.moodReport.note = note;
        return this;
    }

    build() {
        return new Mood(this.moodReport);
    }
}
