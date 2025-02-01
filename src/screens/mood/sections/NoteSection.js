import ScreenSection from "@components/containers/ScreenSection";
import TextInput from "@components/ui/TextInput";
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
        <ScreenSection title="Co dobrego cię dziś spotkało?">
            <TextInput value={note}
                onChange={handleChange}
                multiline={true} />
        </ScreenSection>
    );
}

