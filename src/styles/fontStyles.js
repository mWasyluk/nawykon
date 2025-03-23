import { StyleSheet } from 'react-native';

const fontStyles = StyleSheet.create({
    header: {
        fontFamily: 'Genos_700Bold',
        fontSize: 20,
        lineHeight: 24,
        textTransform: 'uppercase',
    },
    title: {
        fontFamily: 'Genos_700Bold',
        fontSize: 18,
        lineHeight: 22,
        textTransform: 'uppercase',
    },
    body: {
        fontFamily: 'Genos_400Regular',
        fontSize: 16,
        lineHeight: 20,
    },
    bodyBold: {
        fontFamily: 'Genos_700Bold',
        fontSize: 16,
        lineHeight: 20,
    },
    caption: {
        fontFamily: 'Genos_400Regular',
        fontSize: 14,
        lineHeight: 18,
    },
    label: {
        fontFamily: 'Genos_600SemiBold_Italic',
        fontSize: 14,
        lineHeight: 18,
        textTransform: 'uppercase',
    },
    action: {
        fontFamily: 'Genos_600SemiBold',
        fontSize: 16,
        lineHeight: 20,
        textTransform: 'uppercase',
    },
    actionLarge: {
        fontFamily: 'Genos_600SemiBold',
        fontSize: 20,
        lineHeight: 24,
        textTransform: 'uppercase',
    },
});

export default fontStyles;
