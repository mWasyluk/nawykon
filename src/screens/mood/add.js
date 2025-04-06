import Button from '@components/input/Button';
import { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import routes from '@constants/router';
import { useReports } from '@contexts/ReportsContext';
import { Mood } from '@models/mood/Mood';
import { ModalService } from '@services/modalService';
import { icons, metrics } from '@styles';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
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

    const buttonVariant = error ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.PRIME;

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

            <Button
                title={"Zapisz"}
                icon={icons.check}
                size={INPUT_SIZES.LARGE}
                variant={buttonVariant}

                onPress={handleSave}
                style={{ marginTop: metrics.spacing.md, alignSelf: 'center' }}
            />
        </ScrollView>
    );
}
