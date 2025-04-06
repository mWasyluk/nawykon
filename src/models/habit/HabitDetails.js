import { types } from '@constants/habit';
import { colors } from '@styles';

export class HabitDetails {
    static HABIT_TYPES = Object.keys(types);
    static HABIT_COLORS = [
        colors.modalBackground,
        colors.lightGray,
        colors.primBlue,
        colors.lightSuccess,
        colors.lightWarning,
        colors.lightError
    ];
    static DEFAULT_TYPE = 'productivity';

    constructor(props) {
        const {
            name,
            description,
            type,
            color = HabitDetails.HABIT_COLORS[0],
        } = props;

        HabitDetails.validate({ name, type, color });

        this.type = type;
        this.name = name;
        this.color = color;
        this.description = description || '';
    }

    static validate(details) {
        return HabitDetails.validateName(details.name)
            && HabitDetails.validateType(details.type)
            && HabitDetails.validateColor(details.color);
    }

    static validateName(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Nazwa nie może być pusta.');
        }
        return true;
    }

    static validateType(type) {
        if (!type) {
            throw new Error('Rodzaj nie może być pusty.');
        }
        if (!HabitDetails.HABIT_TYPES.includes(type)) {
            throw new Error('Wybrany typ jest nieprawidłowy.');
        }
        return true;
    }

    static validateColor(color) {
        if (!HabitDetails.HABIT_COLORS.includes(color)) {
            throw new Error('Wybrany kolor jest nieprawidłowy.');
        }
        return true;
    }
}
