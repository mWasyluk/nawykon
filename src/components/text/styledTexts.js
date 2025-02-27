import { fontStyles } from '@styles';
import { Text } from 'react-native';

const HeaderText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.header, style]} {...props}>{children}</Text>);
};

const TitleText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.title, style]} {...props}>{children}</Text>);
};

const BodyText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.body, style]} {...props}>{children}</Text>);
};

const BodyBoldText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.bodyBold, style]} {...props}>{children}</Text>);
};

const CaptionText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.caption, style]} {...props}>{children}</Text>);
};

const ActionText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.action, style]} {...props}>{children}</Text>);
};

const ActionLargeText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.actionLarge, style]} {...props}>{children}</Text>);
};

const LabelText = ({ children, style, ...props }) => {
    return (<Text style={[fontStyles.label, style]} {...props}>{children}</Text>);
};

export { HeaderText, TitleText, BodyText, BodyBoldText, CaptionText, ActionText, ActionLargeText, LabelText };
