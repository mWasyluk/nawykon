import ScreenSection from '@components/layout/ScreenSection';
import { BodyText, TitleText } from '@components/text';
import { colors, icons } from '@styles';
import { Image, StyleSheet } from 'react-native';

export default function PointsSection(props) {
    const {
        points = 0,
    } = props;

    return (
        <ScreenSection title="Punkty" containerStyle={styles.container} >
            <BodyText>Aktualnie posiadasz</BodyText>
            <TitleText style={styles.pointsText}>{points}</TitleText>
            <Image source={icons.point} style={styles.pointsIcon} />
        </ScreenSection>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pointsText: {
        color: colors.darkGray,
        marginLeft: 10,
    },
    pointsIcon: {
        width: 48,
        height: 48,
    },
});
