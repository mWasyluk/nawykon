import TextInput from "@components/input/TextInput";
import { SectionContainer, SectionHeader } from "@components/layout";
import { useState } from "react";

export default function NoteSection(props) {
    const {
        defaultValue,
        onChange = () => { },
    } = props;

    const [note, setNote] = useState(defaultValue || '');

    const handleChange = (value) => {
        setNote(value);
        onChange(value);
    };

    return (
        <SectionContainer style={{ gap: 0 }}>
            <SectionHeader
                title="Notatka"
            />
            <TextInput
                value={note}
                onChange={handleChange}
                multiline={true} />
        </SectionContainer>
    );
}

