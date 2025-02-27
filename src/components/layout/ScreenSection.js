import { TitleText } from '@components/text';
import { colors } from '@styles';
import { StyleSheet, View } from 'react-native';

export default function ScreenSection({
    title,
    rightComponent = null,
    children,
    containerStyle = {},
    titleStyle = {},
}) {
    return (
        <View style={[styles.container]}>
            {(title || rightComponent) &&
                <View style={styles.headerRow}>
                    <TitleText style={[styles.title, titleStyle]}>{title}</TitleText>
                    {rightComponent && (
                        <View style={styles.rightComponent}>{rightComponent}</View>
                    )}
                </View>}

            {children &&
                <View style={[styles.content, containerStyle]}>
                    {children}
                </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 10,
        padding: 10,
        paddingVertical: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    title: {
        color: colors.darkGray,
    },
    rightComponent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        width: '100%',
        gap: 10,
    },
});
