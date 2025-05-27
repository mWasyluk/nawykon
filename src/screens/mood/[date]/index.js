import Button, { LOADING_ICON } from '@components/input/Button';
import { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import { ScreenContainer } from '@components/layout';
import { useReports } from '@contexts/ReportsContext';
import { Mood } from '@models/mood/Mood';
import { ModalService } from '@services/modalService';
import { icons, metrics } from '@styles';
import { NavigationUtil } from '@utils/navUtil';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useMemo, useState } from 'react';
import NoteSection from '../sections/NoteSection';
import FettleSection from '../sections/FettleSection';

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

    const handleFettleChange = (value) => {
        setMoodDto({ ...moodDto, ...value });
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
            <FettleSection
                defaultValue={moodDto || {}}
                onChange={handleFettleChange} />
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
