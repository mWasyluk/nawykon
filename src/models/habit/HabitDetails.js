import { types } from '@data/habit';

export class HabitDetails {
    static HABIT_TYPES = Object.keys(types);
    static DEFAULT_TYPE = 'productivity';

    constructor(props) {
        const {
            name,
            description,
            type,
        } = props;

        HabitDetails.validate({ name, description, type });

        this.type = type;
        this.name = name;
        this.description = description || '';
    }

    static validate(details) {
        return HabitDetails.validateName(details.name)
            && HabitDetails.validateType(details.type);
    }

    static validateName(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Nazwa nie może być pusta.');
        }
        return true;
    }

    static validateType(type) {
        if (!type || !HabitDetails.HABIT_TYPES.includes(type)) {
            throw new Error('Wybrany typ jest nieprawidłowy.');
        }
        return true;
    }
}

export const defaultHabitDetailsProps = {
    name: '',
    description: '',
    type: 'productivity'
};
