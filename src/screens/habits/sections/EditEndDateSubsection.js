import DatePicker from '@components/input/datetime/DatePicker';
import Switch from '@components/input/Switch';
import { formatDate } from '@utils/dateUtil';
import { useState } from 'react';
import { View } from 'react-native';

const nextWeekDate = formatDate(new Date(new Date().setDate(new Date().getDate() + 7)), 'date');

export default function EditEndDateSubsection(props) {
    const {
        endDate = undefined,
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
            <View style={{ width: 120, opacity: isOn ? 1 : 0 }}>
                <DatePicker
                    date={endDate}
                    minDate={new Date()}
                    onChange={onChange}
                    disabled={!isOn}
                />
            </View>
        </View>
    );
}
