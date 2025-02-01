import React, { use, useEffect, useState } from 'react';
import { defaultHabitDetailsProps, HabitDetails } from '@models/habit/HabitDetails';
import SelectableHabitTypeAvatar from '@components/habit/SelectableHabitTypeAvatar';
import ScreenSection from '@components/containers/ScreenSection';

export default function PickHabitSection(props) {
    const {
        defaultType = defaultHabitDetailsProps.type,
        onChange = () => { },
    } = props;

    const [habitType, setHabitType] = useState(defaultType);

    const handleSelect = (habitType) => {
        onChange(habitType);
        setHabitType(habitType);
    };

    useEffect(() => {
        onChange(habitType);
    }, [habitType]);

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
        </ScreenSection>
    );
}
