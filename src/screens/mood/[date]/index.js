import Button, { LOADING_ICON } from '@components/input/Button';
import { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import { useReports } from '@contexts/ReportsContext';
import { Mood } from '@models/mood/Mood';
import { ModalService } from '@services/modalService';
import { icons, metrics } from '@styles';
import { NavigationUtil } from '@utils/navUtil';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useMemo, useState } from 'react';
import { ScreenContainer } from 'react-native-screens';
import NoteSection from '../sections/NoteSection';
import PickEnergySection from '../sections/PickEnergySection';
import PickMoodSection from '../sections/PickMoodSection';

export default function EditMoodScreen() {
    const { date: targetDate } = useLocalSearchParams();
    const { dailyReports, setMood, isLoading } = useReports();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const moodReport = useMemo(() => {
        const targetDailyReport = dailyReports.find(report => report.date === targetDate);
        return targetDailyReport?.mood;
    }, [targetDate, dailyReports]);

    const [moodDto, setMoodDto] = useState(moodReport || {});
    const [isError, setIsError] = useState(false);

    const buttonIcon = isSubmitting ? LOADING_ICON : icons.check;
    const buttonVariant = (isError || isSubmitting) ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.PRIME;

    const handleHumorChange = (value) => {
        setMoodDto({ ...moodDto, humor: value });
    }

    const handleEnergyChange = (value) => {
        setMoodDto({ ...moodDto, energy: value });
    }

    const handleNoteChange = (value) => {
        setMoodDto({ ...moodDto, note: value });
    }

    const handleSave = async () => {
        try {
            setIsSubmitting(true);
            await setMood(targetDate, new Mood(moodDto));
        } catch (error) {
            ModalService.showError(error.message);
        }
    }

    useEffect(() => {
        if (isSubmitting && !isLoading) {
            setIsSubmitting(false);
            NavigationUtil.goBackOrHome();
        }
    }, [isLoading, isSubmitting]);

    useEffect(() => {
        try {
            new Mood(moodDto);
            setIsError(false);
        } catch (error) {
            setIsError(true);
        }
    }, [moodDto]);

    return (
        <ScreenContainer >
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
                icon={buttonIcon}
                size={INPUT_SIZES.LARGE}
                variant={buttonVariant}

                onPress={handleSave}
                style={{ marginTop: metrics.spacing.md, alignSelf: 'center' }}
            />
        </ScreenContainer>
    );
}
