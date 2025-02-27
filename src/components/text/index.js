import { fontStyles } from '@styles';
import { Text } from 'react-native';

const HeaderText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.sectionHeader, style]} {...props}>{children}</Text>);
};

const TitleText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.regularTitle, style]} {...props}>{children}</Text>);
};

const RegularText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.regular, style]} {...props}>{children}</Text>);
};

const RegularBoldText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.regularBold, style]} {...props}>{children}</Text>);
};

const NoteText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.regularNote, style]} {...props}>{children}</Text>);
};

const ButtonText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.button, style]} {...props}>{children}</Text>);
};

const BigButtonText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.bigButton, style]} {...props}>{children}</Text>);
};

const LabelText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.textFieldLabel, style]} {...props}>{children}</Text>);
};

export * from './AdaptiveRegularText';
export * from './OptionalErrorText';
export { BigButtonText, ButtonText, HeaderText, LabelText, NoteText, RegularBoldText, RegularText, TitleText };

