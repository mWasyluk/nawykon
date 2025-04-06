import { uiStyles } from '@styles';
import { TouchableOpacity } from 'react-native';
import HabitAvatar from './HabitAvatar';

export default function SelectableHabitType(props) {
    const {
        type = 'fitness',
        color = undefined,
        isSelected = false,
        onPress = () => { },
    } = props;

    const backgroundColor = isSelected ? color : undefined;

    return (
        <TouchableOpacity onPress={onPress}>
            <HabitAvatar type={type} color={backgroundColor} style={{ ...uiStyles.lightShadow }} />
        </TouchableOpacity >
    );
}
