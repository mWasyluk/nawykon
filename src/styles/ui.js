import colors from "./colors";
import fontStyles from "./fontStyles";

const defaultButtonStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 44,
    backgroundColor: colors.primBlue,
    gap: 10,
    borderWidth: 2,
};

const uiStyles = {
    smallButton: {
        height: 32,
        ...defaultButtonStyle,
        paddingHorizontal: 10,
    },
    button: {
        height: 48,
        ...defaultButtonStyle,
        paddingHorizontal: 30,
    },
    input: {
        height: 32,

        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,

        borderWidth: 2,
        borderColor: colors.lightGray,
        borderRadius: 16,
        outlineStyle: 'none',

        overflow: 'hidden',
        ...fontStyles.regular,
        color: colors.midGray,
    },
}

export default uiStyles;
