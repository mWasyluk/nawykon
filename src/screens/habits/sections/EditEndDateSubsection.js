import { INPUT_VARIANTS } from '@components/input/InputContainer';
import Switch from '@components/input/Switch';
import TextInput from '@components/input/TextInput';
import { formatDate } from '@utils/dateUtil';
import { useState } from 'react';
import { View } from 'react-native';

const nextWeekDate = formatDate(new Date(new Date().setDate(new Date().getDate() + 7)), 'date');

export default function EditEndDateSubsection(props) {
    const {
        endDate = undefined,
        error = null,
        onChange = () => { },
        style = {},
    } = props;

    const [isOn, setIsOn] = useState(!!endDate);

    const handleSwitchChange = (newIsOn) => {
        setIsOn(newIsOn);
        onChange(newIsOn ? nextWeekDate : undefined);
    }

    return (
        <View style={style}>
            <Switch isOn={isOn} onChange={handleSwitchChange} />
            <View style={{ width: 120 }}>
                <TextInput
                    value={endDate}
                    onChange={onChange}
                    maxLength={10}
                    error={error}
                    textStyle={{ textAlign: 'center' }}

                    variant={isOn ? undefined : INPUT_VARIANTS.DISABLED}
                    style={{ opacity: isOn ? 1 : 0 }}
                />
            </View>
        </View>
    );
}
