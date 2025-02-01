export class Preferences {
    static VALID_THEMES = ['light', 'dark'];

    constructor({ theme, zoom }) {
        if (theme && !Preferences.VALID_THEMES.includes(theme)) {
            throw new Error(`Invalid theme. Valid options are: ${Preferences.VALID_THEMES.join(', ')}`);
        }
        if (zoom && (typeof zoom !== 'number' || zoom < 0)) {
            throw new Error('Zoom must not be a negative number');
        }

        this.theme = theme || 'light';
        this.fontSize = zoom || 100;
    }
}
