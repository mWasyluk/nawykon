import React, { useEffect, useState } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '@utils/dateUtil';
import InputContainer, { INPUT_VARIANTS } from '../InputContainer';
import { colors, fontStyles } from '@styles';

const DatePicker = (props) => {
    const {
        date = new Date(),
        minDate,

        onChange = () => { },
        disabled = false,
    } = props;

    const [show, setShow] = useState(false);

    const handleChange = (event, selectedDate) => {
        setShow(false);
        onChange(selectedDate);
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
                <Text style={textStyles}>{formatDate(date, "date")}</Text>
            </InputContainer>

            {show && (
                <DateTimePicker
                    value={new Date(date)}
                    mode="date"
                    minimumDate={new Date(minDate)}
                    onChange={handleChange}
                />
            )}
        </View>
    );
};

export default DatePicker;
