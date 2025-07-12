import personListSrc from '@assets/hero/person-list.png';
import personOkSrc from '@assets/hero/person-ok.png';
import { ProgressBar } from '@components/activity/ProgessBar';
import BackgroundGradient from '@components/effects/BackgroundGradient';
import { BodyBoldText, CaptionText } from '@components/text';
import { useActivity } from '@contexts/ActivitiesContext';
import { colors, metrics } from '@styles';
import { ActivityUtil } from '@utils/activityUtil';
import { formatDate } from '@utils/dateUtil';
import { Image, StyleSheet, View } from 'react-native';

function getTaskForm(number) {
    if (number === 1) {
        return 'zadanie';
    } else if (number > 1 && number < 5) {
        return 'zadania';
    } else {
        return 'zadań';
    }
}

const heroVariants = {
    noneGoal: {
        imgSrc: personListSrc,
        title: 'Lista zadań na dzis jest pusta',
        description: 'Poniżej możesz dodać nowy nawyk. Nie ma czasu, żeby tracić czas!'
    },
    noneDone(goal) {
        return {
            imgSrc: personListSrc,
            title: `Na dzisiejszej liście mamy ${goal} ${getTaskForm(goal)}`,
            description: 'Czas brać się do pracy!'
        }
    },
    progress(done, goal) {
        return {
            imgSrc: personListSrc,
            imgWidth: 38.25,
            title: `Widzę, że zostało Ci ${goal - done} z ${goal} zadań`,
            description: `Świetnie Ci idzie. Tak trzymaj!`
        }
    },
    allDone: {
        imgSrc: personOkSrc,
        imgWidth: 52,
        title: 'To już wszystko na dziś',
        description: 'Znakomita robota, czas odpocząć. Do jutra!'
    }
};

export default function HeroBanner() {
    const { activityRegistry } = useActivity();

    const todaysDate = formatDate(new Date(), 'date');
    const todaysActivityStats = ActivityUtil.calculateHabitStatistics([activityRegistry.getRecord(todaysDate)]);
    const { effectual, goal } = todaysActivityStats.calendar[todaysDate];

    const currentVarian = !goal ? heroVariants.noneGoal
        : !effectual ? heroVariants.noneDone(goal)
            : effectual === goal ? heroVariants.allDone
                : heroVariants.progress(effectual, goal);

    const imgWidth = currentVarian.imgSrc === personListSrc ? 38.25 : 52;
    const imgPadding = currentVarian.imgSrc === personListSrc ? 23.75 : 11;

    return (
        <View style={styles.container}>
            <BackgroundGradient />
            <BodyBoldText style={{ color: colors.light }}>{currentVarian.title}</BodyBoldText>
            <CaptionText style={{ color: colors.light }}>{currentVarian.description}</CaptionText>
            {currentVarian !== heroVariants.noneGoal
                && <ProgressBar value={effectual} maxValue={goal} />
            }
            <Image source={currentVarian.imgSrc} style={[styles.image, { right: imgPadding, width: imgWidth }]} resizeMode='contain' resizeMethod='scale' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',

        minHeight: 96,
        gap: metrics.spacing.xs,
        marginTop: metrics.spacing.sm,
        padding: metrics.spacing.sm,
        paddingRight: 70,

        backgroundColor: colors.primBlue,
        borderRadius: metrics.spacing.sm,
    },
    image: {
        position: 'absolute',
        height: 96,
        bottom: metrics.spacing.sm,
    },
});
