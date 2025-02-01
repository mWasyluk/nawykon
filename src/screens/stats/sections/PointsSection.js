import ScreenSection from '@components/containers/ScreenSection';
import TextOption from '@components/ui/TextOption';
import { colors, fontStyles, icons } from '@styles';
import { Image, StyleSheet, Text } from 'react-native';

export default function PointsSection(props) {
    const {
        points = 0,
    } = props;

    return (
        <ScreenSection title="Punkty" containerStyle={styles.container} >
            <TextOption>Aktualnie posiadasz</TextOption>
            <Text style={styles.pointsText}>{points}</Text>
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
        ...fontStyles.sectionHeader,
        color: colors.darkGray,

        marginLeft: 10,
    },
    pointsIcon: {
        width: 48,
        height: 48,
    },
});
