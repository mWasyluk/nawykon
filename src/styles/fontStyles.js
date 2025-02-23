import { StyleSheet } from 'react-native';

// Genos_400Regular,
//     Genos_500Medium,
//     Genos_600SemiBold,
//     Genos_600SemiBold_Italic,
//     Genos_700Bold

const fontStyles = StyleSheet.create({
    sectionHeader: {
        fontFamily: 'Genos_700Bold',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    regularTitle: {
        fontFamily: 'Genos_700Bold',
        fontSize: 18,
        textTransform: 'uppercase',
    },
    regular: {
        fontFamily: 'Genos_400Regular',
        fontSize: 16,
    },
    regularBold: {
        fontFamily: 'Genos_700Bold',
        fontSize: 16,
    },
    regularNote: {
        fontFamily: 'Genos_400Regular',
        fontSize: 14,
    },
    button: {
        fontFamily: 'Genos_600SemiBold',
        fontSize: 16,
        textTransform: 'uppercase',
    },
    bigButton: {
        fontFamily: 'Genos_600SemiBold',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    textFieldLabel: {
        fontFamily: 'Genos_600SemiBold_Italic',
        fontSize: 14,
        textTransform: 'uppercase',
    },
});

export default fontStyles;
