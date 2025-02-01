import Button from '@components/ui/Button';
import routes from '@data/router';
import { icons } from '@styles';
import { ScrollView } from 'react-native';
import NoteSection from './sections/NoteSection';
import PickMoodSection from './sections/PickMoodSection';
import PickEnergySection from './sections/PickEnergySection';
import { useUser } from 'src/context/UserContext';
import { useReports } from 'src/context/ReportsContext';
import { MoodReport } from '@models/reports/MoodReport';
import { useEffect, useState } from 'react';

export default function AddMoodScreen() {
    const { user } = useUser();
    const { moodReport, addMoodReport, editMoodReport } = useReports();
    const [moodReportDto, setMoodReportDto] = useState({ userId: user.id, ...moodReport });
    const [isSaveReady, setIsSaveReady] = useState(false);

    const handleMoodChange = (value) => {
        setMoodReportDto({ ...moodReportDto, mood: value });
    }

    const handleEnergyChange = (value) => {
        setMoodReportDto({ ...moodReportDto, energy: value });
    }

    const handleNoteChange = (value) => {
        setMoodReportDto({ ...moodReportDto, note: value });
    }

    const handleSave = () => {
        if (moodReport) {
            editMoodReport(new MoodReport(moodReportDto));
        } else {
            addMoodReport(new MoodReport(moodReportDto));
        }
    }

    useEffect(() => {
        const verifyReport = () => {
            try {
                new MoodReport(moodReportDto);
                setIsSaveReady(true);
            } catch (err) {
                console.warn(err);
                setIsSaveReady(false);
            }
        }

        verifyReport();
    }, [moodReportDto]);

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <PickMoodSection
                defaultValue={moodReportDto?.mood}
                onChange={handleMoodChange} />
            <PickEnergySection
                defaultValue={moodReportDto?.energy}
                onChange={handleEnergyChange} />
            <NoteSection
                defaultValue={moodReportDto?.note}
                onChange={handleNoteChange} />

            <Button title={"Zapisz"}
                icon={icons.check}
                onPress={handleSave}
                href={routes.dashboard}
                style={{ marginVertical: 20 }}
                disabled={!isSaveReady} />
        </ScrollView>
    );
}
