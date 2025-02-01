// ScreenSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontStyles } from '@styles';

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
                    <Text style={[styles.title, titleStyle]}>{title}</Text>
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
        ...fontStyles.sectionHeader,
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
