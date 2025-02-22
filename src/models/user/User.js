export class User {
    constructor({ uid, username, preferences }) {
        this.uid = uid;
        this.username = username;
        this.preferences = preferences instanceof UserPreferences ? preferences : new UserPreferences({ ...preferences });
    }

    static validateEmail(email) {
        // requires at list one sign before @, at least one sign between @ and ., at least 2 signs after .
        if (!email) {
            throw new Error('E-mail jest wymagany.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new Error('Adres e-mail jest niepoprawny.');
        }
    }

    static validatePassword(password) {
        if (!password) {
            throw new Error('Hasło jest wymagane.');
        }
    }

}

export class UserPreferences {
    static VALID_THEMES = ['light', 'dark'];

    constructor({ theme, zoom }) {
        if (theme && !UserPreferences.VALID_THEMES.includes(theme)) {
            throw new Error(`Motyw powinien mieć jedną z następujących wartości: ${UserPreferences.VALID_THEMES.join(', ')}`);
        }
        if (zoom && (typeof zoom !== 'number' || zoom < 25 || zoom > 200)) {
            throw new Error(`Wartość przybliżenia ekranu musi być liczbą z zakresu 25-200.`);
        }

        this.theme = theme || 'light';
        this.zoom = zoom || 100;
    }
}
