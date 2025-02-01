import { types } from '@data/habit';
import { validateTimestamp } from '@utils/dateUtil';

export class HabitDetails {
    static HABIT_TYPES = Object.keys(types);

    constructor(props) {
        const {
            name,
            description,
            type,
            createDate = new Date()
        } = props;

        HabitDetails.validate({ name, description, type, createDate });

        this.createDate = validateTimestamp(createDate);
        this.type = type;
        this.name = name;
        this.description = description || '';
    }

    static validate(details) {
        return HabitDetails.validateName(details.name)
            && HabitDetails.validateType(details.type)
            && HabitDetails.validateCreateDate(details.createDate);
    }

    static validateCreateDate(createDate) {
        if (!createDate) {
            throw new Error('Data utworzenia nie może być pusta.');
        }

        try {
            validateTimestamp(createDate);
        } catch (error) {
            throw new Error('Data utworzenia nawyku ma nieprawidłowy format.');
        }

        if (new Date(createDate) > new Date()) {
            throw new Error('Data utworzenia nie może być w przyszłości.');
        }

        return true
    }

    static validateName(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Nazwa nie może być pusta.');
        }
        return true;
    }

    static validateType(type) {
        if (!type || !HabitDetails.HABIT_TYPES.includes(type)) {
            throw new Error(`${type} is invalid habit type. Valid options are: ${HabitDetails.HABIT_TYPES.join(', ')}`);
        }
        return true;
    }
}

export const defaultHabitDetailsProps = {
    name: '',
    description: '',
    type: 'productivity',
    createDate: undefined
};
