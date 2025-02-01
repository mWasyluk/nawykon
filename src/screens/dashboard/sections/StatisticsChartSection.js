import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fontStyles, icons } from '@styles';
import TextOptionPicker from '@components/ui/TextOptionPicker';
import PieChart from '@components/PieChart';
import ScreenSection from '@components/containers/ScreenSection';
import Button from '@components/ui/Button';
import routes from '@data/router';

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
                        <Text style={styles.pointsText}>{selectedOption.points}</Text>
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
                        <Text style={styles.doneText}>{`${Math.round(selectedOption.done / recordsSum * 100)}% (${selectedOption.done} z ${recordsSum})`}</Text>
                        <Text style={styles.darkGrayText}> ukończonych</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.waitingText}>{`${Math.round(selectedOption.waiting / recordsSum * 100)}% (${selectedOption.waiting})`}</Text>
                        <Text style={styles.darkGrayText}> oczekujących</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.failedText}>{`${Math.round(selectedOption.failed / recordsSum * 100)}% (${selectedOption.failed})`}</Text>
                        <Text style={styles.darkGrayText}> niezaliczonych</Text>
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
        ...fontStyles.regularTitle,
        color: colors.darkGray,
        marginRight: -5,
    },
    doneText: {
        ...fontStyles.regularBold,
        color: colors.lightSuccess,
    },
    waitingText: {
        ...fontStyles.regular,
        color: colors.darkWarning,
    },
    failedText: {
        ...fontStyles.regular,
        color: colors.lightError,
    },
    darkGrayText: {
        ...fontStyles.regular,
        color: colors.darkGray,
    },
});
