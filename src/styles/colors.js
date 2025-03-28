const colors = {
    light: '#F3F3F3',

    primBlue: '#007BFF',
    darkBlue: '#0056B3',

    lightGray: '#CED4DA',
    midGray: '#868C93',
    darkGray: '#485058',
    xDarkGray: '#212529',

    modalBackground: '#FFFFFF',

    lightSuccess: '#28A745',
    darkSuccess: '#218838',

    lightWarning: '#FFC107',
    darkWarning: '#C19100',

    lightError: '#DC3545',
    darkError: '#A01724',

    getContrastFor: (color) => {
        return isLight(color) ? colors.darkGray : colors.light;
    }
};

const isLight = (hexColor) => {
    try {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        // Calculate perceived brightness (luminance)
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return brightness > 0.5;
    } catch (error) {
        throw new Error('Cannot determine color brightness for ' + hexColor);
    }
}

export default colors;
