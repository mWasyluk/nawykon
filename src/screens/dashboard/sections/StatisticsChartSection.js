import PieChart from '@components/charts/PieChart';
import Button from '@components/input/Button';
import TextOptionPicker from '@components/input/TextOptionPicker';
import ScreenSection from '@components/layout/ScreenSection';
import { BodyBoldText, BodyText, TitleText } from '@components/text';
import routes from '@constants/router';
import { colors, icons } from '@styles';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function StatisticsChartSection(props) {
    const {
        periodRecords = [
            { name: '30 dni', points: 195, done: 212, waiting: 3, failed: 17 },
            { name: '7 dni', points: 45, done: 52, waiting: 3, failed: 7 },
            { name: 'Dzień', points: 6, done: 8, waiting: 2, failed: 2 },
        ],
    } = props;

    const defaultOption = periodRecords[periodRecords.length - 1];
    const [selectedOption, setSelectedOption] = useState(defaultOption);

    const handleOptionChange = (optionName) => {
        const option = periodRecords.filter((item) => item.name === optionName)[0];
        setSelectedOption(option);
    };

    const recordsSum = selectedOption.done + selectedOption.waiting + selectedOption.failed;

    return (
        <ScreenSection
            title={"Statystyki"}
            rightComponent={
                <Button href={routes.statistics}
                    title={"Szczegóły"}
                    prim={false}
                    small={true}
                />
            }
        >
            <View style={styles.row}>
                <View style={styles.pieChartContainer}>
                    <PieChart
                        data={[selectedOption.done, selectedOption.waiting, selectedOption.failed]}
                        colors={[colors.lightSuccess, colors.lightWarning, colors.lightError]}
                        size={128}
                    />
                    <View style={styles.pieChartCenter}>
                        <TitleText style={styles.pointsText}>{selectedOption.points}</TitleText>
                        <Image source={icons.point} style={styles.icon} />
                    </View>
                </View>

                <View style={styles.container}>
                    <TextOptionPicker
                        options={periodRecords.map((item) => item.name)}
                        initIndex={periodRecords.indexOf(selectedOption)}
                        onOptionChange={handleOptionChange}
                        style={{ marginBottom: 20 }}
                    />

                    <View style={styles.row}>
                        <BodyBoldText style={styles.doneText}>{`${Math.round(selectedOption.done / recordsSum * 100)}% (${selectedOption.done} z ${recordsSum})`}</BodyBoldText>
                        <BodyText style={styles.darkGrayText}> ukończonych</BodyText>
                    </View>

                    <View style={styles.row}>
                        <BodyText style={styles.waitingText}>{`${Math.round(selectedOption.waiting / recordsSum * 100)}% (${selectedOption.waiting})`}</BodyText>
                        <BodyText style={styles.darkGrayText}> oczekujących</BodyText>
                    </View>

                    <View style={styles.row}>
                        <BodyText style={styles.failedText}>{`${Math.round(selectedOption.failed / recordsSum * 100)}% (${selectedOption.failed})`}</BodyText>
                        <BodyText style={styles.darkGrayText}> niezaliczonych</BodyText>
                    </View>
                </View>
            </View>
        </ScreenSection>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 2,
    },
    pieChartContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 'fit-content',
        position: 'relative',
    },
    pieChartCenter: {
        position: 'absolute',
        top: 64,
        left: 64,
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 32,
        height: 32,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    pointsText: {
        color: colors.darkGray,
        marginRight: -5,
    },
    doneText: {
        color: colors.lightSuccess,
    },
    waitingText: {
        color: colors.darkWarning,
    },
    failedText: {
        color: colors.lightError,
    },
    darkGrayText: {
        color: colors.darkGray,
    },
});
