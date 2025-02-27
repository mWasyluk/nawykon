import LineChart from '@components/charts/LineChart';
import ScreenSection from '@components/layout/ScreenSection';
import TextOptionPicker from '@components/input/TextOptionPicker';
import { useState } from 'react';
import StatisticsPresentation from '@components/activity/StatisticsPresentation';

export default function ProgressSection(props) {
    const {
        data = [],
        currentPoints = undefined,
    } = props;

    const periodNames = data.map((data) => data.period);
    const [currentPeriodName, setCurrentPeriodName] = useState(periodNames[periodNames.length - 1]);

    const currentPeriodData = data.filter((periodData) => periodData.period === currentPeriodName)[0] || {};

    return (
        <ScreenSection title="Postęp" containerStyle={{ alignItems: 'center' }} >
            <TextOptionPicker
                options={periodNames}
                initIndex={2}
                loop={false}
                onOptionChange={setCurrentPeriodName}
                style={{}}
            />
            <LineChart
                data={currentPeriodData.chartData}
                currentPoints={currentPoints}
            />

            <StatisticsPresentation
                effectiveness={currentPeriodData.effectiveness}
                longestStreak={currentPeriodData.longestStreak}
                completed={currentPeriodData.completed}
                failed={currentPeriodData.failed}
            />

        </ScreenSection>
    );
}
