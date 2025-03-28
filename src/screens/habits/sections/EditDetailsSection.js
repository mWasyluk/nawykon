import TextInput from '@components/input/TextInput';
import { SectionContainer, SectionHeader, SubsectionHeader } from '@components/layout';
import { OptionalErrorText } from '@components/text';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function EditDetailsSection({ habitBuilder }) {
    const {
        name = habitBuilder.habit?.details.name || '',
        description = habitBuilder.habit?.details.description || ''
    } = habitBuilder;

    const [nameError, setNameError] = useState(null);

    const handleNameChange = (value) => {
        try {
            habitBuilder.withName(value);
            setNameError('');
        } catch (error) {
            setNameError(error.message);
        }
    };

    const handleDescriptionChange = (value) => {
        habitBuilder.withDescription(value);
    }

    useEffect(() => {
        try {
            habitBuilder.withName(name);
            habitBuilder.withDescription(description);
        } catch (error) { }
    }, []);

    return (
        <SectionContainer>
            <SectionHeader title={'Szczegóły'} />

            <View>
                <SubsectionHeader title={'Nazwa'} isRequired={true} />
                <TextInput
                    value={name}
                    onChange={handleNameChange}
                    error={nameError}
                />
            </View>
            <OptionalErrorText>{nameError}</OptionalErrorText>

            <View>
                <SubsectionHeader title={'Opis'} />
                <TextInput
                    value={description}
                    onChange={handleDescriptionChange}
                    multiline={true}
                />
            </View>

        </SectionContainer>
    );
}
