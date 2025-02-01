import { validateTimestamp } from '@utils/dateUtil';

export class MoodReport {
    static MOOD_RANGE = [0, 4];
    static ENERGY_RANGE = [0, 2];

    constructor(props) {
        const {
            id,
            userId,
            mood,
            energy,
            note,
            timestamp = new Date(),
        } = props;

        if (!userId) {
            throw new Error('User ID is required during MoodReport creation');
        }
        if (mood === undefined || mood === null || mood < MoodReport.MOOD_RANGE[0] || mood > MoodReport.MOOD_RANGE[1]) {
            throw new Error(`Mood must be between ${MoodReport.MOOD_RANGE[0]} and ${MoodReport.MOOD_RANGE[1]}`);
        }
        if (energy === undefined || energy === null || energy < MoodReport.ENERGY_RANGE[0] || energy > MoodReport.ENERGY_RANGE[1]) {
            throw new Error(`Energy must be between ${MoodReport.ENERGY_RANGE[0]} and ${MoodReport.ENERGY_RANGE[1]}`);
        }

        this.id = id;
        this.userId = userId;
        this.mood = mood;
        this.energy = energy;
        this.note = note;
        this.timestamp = validateTimestamp(timestamp);
    }
}
