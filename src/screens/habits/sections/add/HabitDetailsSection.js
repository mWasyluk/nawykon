import ScreenSection from '@components/containers/ScreenSection';
import ErrorMessage from '@components/ui/ErrorMessage';
import TextInput from '@components/ui/TextInput';
import { useEffect, useState } from 'react';

export default function HabitDetailsSection(props) {
    const {
        habitBuilder,
    } = props;

    const currentHabitDetails = habitBuilder.habit?.details;
    const [name, setName] = useState(currentHabitDetails?.name || '');
    const [description, setDescription] = useState(currentHabitDetails?.description || '');
    const [nameError, setNameError] = useState(null);

    const handleNameChange = (value) => {
        try {
            habitBuilder.withName(value);
            setNameError('');
        } catch (error) {
            setNameError(error.message);
        }
        setName(value);
    };

    const handleDescriptionChange = (value) => {
        habitBuilder.withDescription(value);
        setDescription(value);
    }

    useEffect(() => {
        if (!currentHabitDetails) {
            try {
                habitBuilder.withName(name);
                habitBuilder.withDescription(description);
            } catch (error) { }
        }
    }, []);

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
