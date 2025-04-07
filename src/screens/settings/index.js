import { ScreenContainer, SectionContainer } from '@components/layout';
import ScreenSection from '@components/layout/ScreenSection';
import { PressableText, TitleText } from '@components/text';
import { colors, icons, metrics, uiStyles } from '@styles';
import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import AccountSectionContent from './sections/AccountSection';

const SECTION_IDS = {
    ACCOUNT: 'account',
}

const ExpandButton = ({ title, onPress, isActive }) => {
    const iconStyle = [
        styles.expandIcon,
        { transform: [{ rotate: isActive ? '90deg' : '0deg' }] },
    ];
    const color = colors.darkGray;

    return (
        <TouchableOpacity style={styles.expandButton} onPress={onPress}>
            <Image
                source={icons.chevronRight}
                style={iconStyle}
                tintColor={color}
            />
            <TitleText style={{ color }}>{title}</TitleText>
        </TouchableOpacity>
    )
}

export default function SettingsScreen() {
    const [expanded, setExpanded] = useState(SECTION_IDS.ACCOUNT);

    const handleExpandPress = (section) => {
        setExpanded((prev) => (prev === section ? null : section));
    }

    return (
        <ScreenContainer>
            <SectionContainer>
                <ExpandButton
                    title={"Konto"}
                    onPress={() => handleExpandPress(SECTION_IDS.ACCOUNT)}
                    isActive={expanded === SECTION_IDS.ACCOUNT}
                />
                {expanded === SECTION_IDS.ACCOUNT && (
                    <AccountSectionContent style={styles.section} />
                )}
            </SectionContainer>

            <ScreenSection title="Aplikacja">
                <PressableText disabled={true}>Powiadomienia</PressableText>
                <PressableText disabled={true}>Wyświetlanie</PressableText>
            </ScreenSection>
            <ScreenSection title="Informacje">
                <PressableText disabled={true}>Regulamin użytkownika</PressableText>
                <PressableText disabled={true}>Polityka prywatności</PressableText>
                <PressableText disabled={true}>Pomoc</PressableText>
            </ScreenSection>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    section: {
        padding: metrics.spacing.sm,
        gap: metrics.spacing.sm,
        borderRadius: metrics.borderRadius.sm,
        backgroundColor: colors.modalBackground,
        ...uiStyles.lightShadow,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: metrics.spacing.xs,
    },
    expandIcon: {
        height: metrics.imageSize.xss,
        width: metrics.imageSize.xss,
    },
});
