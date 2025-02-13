import Button from '@components/ui/Button';
import routes from '@data/router';
import { Mood } from '@models/mood/Mood';
import ModalService from '@services/modalService';
import { icons } from '@styles';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useReports } from 'src/context/ReportsContext';
import NoteSection from './sections/NoteSection';
import PickEnergySection from './sections/PickEnergySection';
import PickMoodSection from './sections/PickMoodSection';

export default function AddMoodScreen() {
    const { todaysReport, setMood } = useReports();

    const todaysMood = todaysReport?.mood || {};

    const [moodDto, setMoodDto] = useState(todaysMood);
    const [error, setError] = useState(null);

    const handleHumorChange = (value) => {
        setMoodDto({ ...moodDto, humor: value });
    }

    const handleEnergyChange = (value) => {
        setMoodDto({ ...moodDto, energy: value });
    }

    const handleNoteChange = (value) => {
        setMoodDto({ ...moodDto, note: value });
    }

    const handleSave = () => {
        try {
            setMood(todaysReport.date, new Mood(moodDto));
            router.replace(routes.dashboard);
        } catch (error) {
            ModalService.showError(error.message);
        }
    }

    useEffect(() => {
        try {
            new Mood(moodDto);
            setError(false);
        } catch (error) {
            setError(true);
        }
    }, [moodDto]);

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <PickMoodSection
                defaultValue={moodDto?.humor}
                onChange={handleHumorChange} />
            <PickEnergySection
                defaultValue={moodDto?.energy}
                onChange={handleEnergyChange} />
            <NoteSection
                defaultValue={moodDto?.note}
                onChange={handleNoteChange} />

            <Button title={"Zapisz"}
                icon={icons.check}
                onPress={handleSave}
                style={{ marginVertical: 20 }}
                disabled={error} />
        </ScrollView>
    );
}
