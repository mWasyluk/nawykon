export class Preferences {
    static VALID_THEMES = ['light', 'dark'];

    constructor({ theme, zoom }) {
        if (theme && !Preferences.VALID_THEMES.includes(theme)) {
            throw new Error(`Motyw powinien mieć jedną z następujących wartości: ${Preferences.VALID_THEMES.join(', ')}`);
        }
        if (zoom && (typeof zoom !== 'number' || zoom < 25 || zoom > 200)) {
            throw new Error(`Wartość przybliżenia ekranu musi być liczbą z zakresu 25-200.`);
        }

        this.theme = theme || 'light';
        this.zoom = zoom || 100;
    }
}
