import personListSrc from '@assets/person/person-list.png';
import personOkSrc from '@assets/person/person-ok.png';
import ScreenSection from '@components/containers/ScreenSection';
import { ProgressBar } from '@components/progress/ProgessBar';
import { colors, fontStyles } from '@styles';
import { Image, StyleSheet, Text } from 'react-native';
import { useStateManager } from 'src/context/StateManagerContext';

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

export default function HeroBannerSection() {
    const { statistics } = useStateManager();
    const { completed, goal } = statistics.getStatsByDateRange(new Date(), new Date());

    const currentVarian = !goal ? heroVariants.noneGoal
        : !completed ? heroVariants.noneDone(goal)
            : completed === goal ? heroVariants.allDone
                : heroVariants.progress(completed, goal);

    const imgWidth = currentVarian.imgSrc === personListSrc ? 38.25 : 52;
    const imgPadding = currentVarian.imgSrc === personListSrc ? 23.75 : 11;

    return (
        <ScreenSection
            containerStyle={styles.container}
        >
            <Text style={[fontStyles.regularBold, { color: colors.light }]}>{currentVarian.title}</Text>
            <Text style={[fontStyles.regularNote, { color: colors.light }]}>{currentVarian.description}</Text>
            {currentVarian !== heroVariants.noneGoal
                && <ProgressBar progress={completed / goal} />
            }
            <Image source={currentVarian.imgSrc} style={[styles.image, { right: imgPadding, width: imgWidth }]} resizeMode='contain' resizeMethod='scale' />
        </ScreenSection>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 96,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 10,
        paddingRight: 64,
        backgroundColor: colors.primBlue,
        borderRadius: 10,
    },
    image: {
        position: 'absolute',
        height: 96,
        bottom: 10,
    },
});
