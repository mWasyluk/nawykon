import { Habit } from "@models/habit/Habit";

export class Settings {
    constructor({ id = null, notificationsEnabled = false, notificationsTime = '08:00', theme = 'light', fontScale = 1, firstRun = true }) {
        Settings.validate({ notificationsEnabled, notificationsTime, theme, fontScale });
        this.id = id;
        this.notificationsEnabled = notificationsEnabled;
        this.notificationsTime = notificationsTime;
        this.theme = theme;
        this.fontScale = fontScale;
        this.firstRun = firstRun;
    }

    static validate(settings) {
        Settings.validateNotificationsEnabled(settings.notificationsEnabled);
        Settings.validateNotificationsTime(settings.notificationsTime);
        Settings.validateTheme(settings.theme);
        Settings.validateFontScale(settings.fontScale);
    }

    static validateNotificationsEnabled(enabled) {
        if (typeof enabled !== 'boolean') {
            throw new Error('Ustawienie powiadomień musi być wartością logiczną (true/false).');
        }
        return true;
    }

    static validateNotificationsTime(time) {
        Habit.validateReminders([time]);
        return true;
    }

    static validateTheme(theme) {
        if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') {
            throw new Error(`Dozwolone wartości dla motywu to: 'light', 'dark' lub 'auto'.`);
        }
        return true;
    }

    static validateFontScale(scale) {
        if (typeof scale !== 'number' || scale < 0.5 || scale > 2) {
            throw new Error(`Skala czcionki musi być liczbą z zakresu 0.5 - 2.`);
        }
        return true;
    }
}
