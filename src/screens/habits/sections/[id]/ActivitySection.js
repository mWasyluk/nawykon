import PlanStatusCalendar from '@components/activity/PlanStatusCalendar';
import ScreenSection from '@components/containers/ScreenSection';
import ConfirmationModal from '@components/modals/ConfirmationModal';
import Button from '@components/ui/Button';
import TextOptionPicker from '@components/ui/TextOptionPicker';
import { fontStyles, icons } from '@styles';
import { formatDate } from '@utils/dateUtil';
import { useState } from 'react';
import { Text } from 'react-native';
import { View } from 'react-native-web';
import { useError } from 'src/context/ErrorContext';
import { useReports } from 'src/context/ReportsContext';

export default function ActivitySection(props) {
    const {
        data = [],
    } = props;

    const periodNames = data.map((data) => data?.period) || ['Unknown'];
    const [currentPeriodName, setCurrentPeriodName] = useState(periodNames[periodNames.length - 1]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedRecord, setSelectedRecord] = useState(null);
    const { habitReports, editHabitReport } = useReports();
    const { showError } = useError();

    const handleConfirm = () => {
        const habitReport = habitReports.find((report) => report.habitId === selectedRecord.habitId);

        try {
            habitReport.removeExecution(selectedRecord.timestamp);
            editHabitReport(habitReport);
        } catch (error) {
            showError("Nie udało się usunąć rekordu. Zrestartuj aplikację i spróbuj ponownie.");
        }
        setSelectedRecord(null);
    };

    const handleCancel = () => {
        setSelectedRecord(null);
    };

    const currentPeriod = data.filter((periodData) => periodData.period === currentPeriodName)[0];

    const recordsData = currentPeriod?.data.map((data) => ({ status: data.status, date: data.date }));
    const calendarData = {
        isLastDayCurrent: currentPeriod?.data[currentPeriod.data.length - 1].date === formatDate(new Date()),
        firstDayOfWeek: currentPeriod?.firstDayOfWeek,
    }

    const selectedDayReportStats = currentPeriod?.data
        ?.find((data) => data.date === formatDate(selectedDate)) || {};

    const selectedDayExecutions = selectedDayReportStats?.executions || [];

    return (
        <ScreenSection title="Aktywność" containerStyle={{ alignItems: 'center', gap: 10 }} >
            <TextOptionPicker
                options={periodNames}
                initIndex={2}
                loop={false}
                onOptionChange={setCurrentPeriodName}
            />
            <PlanStatusCalendar
                records={recordsData}
                {...calendarData}
                onDaySelect={setSelectedDate}
                selectedDate={selectedDate}
                dynamicRows={true}
            />
            <Text style={{ ...fontStyles.regularNote, marginTop: -10 }}>{formatDate(new Date())}</Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
                {selectedDayExecutions.map((execution, index) => (
                    <Button key={index}
                        onPress={() => setSelectedRecord({ habitId: selectedDayReportStats.habitId, timestamp: execution.timestamp })}
                        title={formatDate(new Date(execution.timestamp), 'shorttime')}
                        prim={false}
                        small={true}
                        icon={icons.check} />
                ))}
            </View>

            <ConfirmationModal
                visible={!!selectedRecord}
                message="Czy chcesz usunąć wybrany rekord?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ScreenSection>
    );
}
