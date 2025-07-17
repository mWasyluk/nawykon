import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fontStyles } from '@styles';
import { useState } from 'react';
import { Text, View } from 'react-native';
import InputContainer from '../InputContainer';

export default function TimePicker(props) {
    const now = new Date();
    const {
        hours = now.getHours(),
        minutes = now.getMinutes(),

        onChange = () => { },
        disabled = false,
    } = props;

    const [show, setShow] = useState(false);

    const handleChange = (event, selectedDate) => {
        setShow(false);
        var selectedHours = selectedDate.getHours();
        var selectedMinutes = selectedDate.getMinutes();
        if (selectedHours < 10) {
            selectedHours = "0" + selectedHours;
        }
        if (selectedMinutes < 10) {
            selectedMinutes = "0" + selectedMinutes;
        }
        onChange(selectedHours + ":" + selectedMinutes);
    };

    const openPicker = () => {
        if (disabled) return;
        setShow(true);
    }

    const textStyles = {
        ...fontStyles.body,
        color: disabled ? colors.lightGray : colors.midGray
    };

    return (
        <View>
            <InputContainer onPress={openPicker}>
                <Text style={textStyles}>{hours}:{minutes}</Text>
            </InputContainer>

            {show && (
                <DateTimePicker
                    value={new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)}
                    mode="time"
                    onChange={handleChange}
                />
            )}
        </View>
    );
};
