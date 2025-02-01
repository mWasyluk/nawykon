import React, { useState } from 'react';
import TextInput from '@components/ui/TextInput';
import ScreenSection from '@components/containers/ScreenSection';
import { defaultHabitDetailsProps, HabitDetails } from '@models/habit/HabitDetails';
import ErrorMessage from '@components/ui/ErrorMessage';

export default function HabitDetailsSection(props) {
    const {
        defaultName = defaultHabitDetailsProps.name,
        defaultDescription = defaultHabitDetailsProps.description,
        onChange = () => { },
    } = props;

    const [name, setName] = useState(defaultName);
    const [description, setDescription] = useState(defaultDescription);
    const [nameError, setNameError] = useState(null);

    const handleNameChange = (value) => {
        try {
            HabitDetails.validateName(value);
            setNameError(null);
        } catch (error) {
            setNameError(error.message);
        }
        setName(value);
        onChange({ name: value });
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);
        onChange({ description: value });
    }

    return (
        <ScreenSection
            title={"Szczegóły"}>
            <TextInput label="Nazwa*"
                value={name}
                onChange={handleNameChange}
                returnKeyType={'next'}
                error={nameError} />
            <ErrorMessage>{nameError}</ErrorMessage>
            <TextInput label="Opis"
                value={description}
                onChange={handleDescriptionChange}
                multiline={true} />
        </ScreenSection>
    );
}
