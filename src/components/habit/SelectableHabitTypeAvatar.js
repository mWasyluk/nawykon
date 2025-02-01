import { colors } from '@styles';
import { TouchableOpacity } from 'react-native';
import HabitTypeAvatar from './HabitTypeAvatar';

export default function SelectableHabitTypeAvatar(props) {
    const {
        type = 'fitness',
        isSelected = false,
        onPress = () => { },
    } = props;

    const backgroundColor = isSelected ? colors.primBlue : colors.light;
    const tintColor = isSelected ? colors.light : colors.midGray;

    return (
        <TouchableOpacity onPress={onPress}>
            <HabitTypeAvatar type={type}
                backgroundColor={backgroundColor}
                tintColor={tintColor} />
        </TouchableOpacity >
    );
}
