import { fontStyles } from '@styles';
import { StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function MarkdownText({ children }) {
    if (!children) {
        return null;
    }

    return (
        <Markdown style={styles.markdown}>
            {children}
        </Markdown>
    );
}

const headingStyle = {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 700,
}

const bodyStyle = {
    marginTop: 5
}

const styles = StyleSheet.create({
    markdown: {
        body: fontStyles.body,
        heading1: headingStyle,
        heading2: headingStyle,
        heading3: headingStyle,
        heading4: headingStyle,
        paragraph: bodyStyle,
        list_item: bodyStyle,
    }
});
