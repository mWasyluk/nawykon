import ScreenSection from '@components/containers/ScreenSection';
import SelectableHabitTypeAvatar from '@components/habit/SelectableHabitTypeAvatar';
import ErrorMessage from '@components/ui/ErrorMessage';
import { HabitDetails } from '@models/habit/HabitDetails';
import { useEffect, useState } from 'react';

export default function PickHabitSection(props) {
    const {
        habitBuilder,
    } = props;

    const currentHabitType = habitBuilder.habit?.details?.type;
    const [habitType, setHabitType] = useState(currentHabitType || HabitDetails.DEFAULT_TYPE);

    const [habitTypeError, setHabitTypeError] = useState(null);

    const handleSelect = (habitType) => {
        try {
            habitBuilder.withType(habitType);
            setHabitTypeError(null);
        } catch (error) {
            setHabitTypeError(error.message);
        }

        setHabitType(habitType);
    };

    useEffect(() => {
        if (!currentHabitType) {
            habitBuilder.withType(HabitDetails.DEFAULT_TYPE);
        }
    }, []);

    return (
        <ScreenSection
            title={"Rodzaj"}
            containerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {HabitDetails.HABIT_TYPES.map((type, i) =>
                <SelectableHabitTypeAvatar
                    key={i}
                    type={type}
                    isSelected={habitType === type}
                    onPress={() => handleSelect(type)} />
            )}
            <ErrorMessage>{habitTypeError}</ErrorMessage>
        </ScreenSection>
    );
}
