import { StyleSheet, View } from 'react-native';
import { BodyBoldText, BodyText, TitleText } from './styledTexts';

const processLine = (line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.match(/^-{3,}$/)) {
        return { type: 'separator' };
    }

    if (trimmedLine === '') {
        return { type: 'spacing' };
    }

    if (trimmedLine.match(/^# .+/)) {
        return { type: 'title', content: trimmedLine.replace(/^# /, '') };
    }

    if (trimmedLine.match(/^#{2,3} .+/)) {
        return { type: 'subtitle', content: trimmedLine.replace(/^#{2,3} /, '') };
    }

    if (trimmedLine.match(/^[\-\*] .+/)) {
        return { type: 'bullet', content: trimmedLine.replace(/^[\-\*] /, '') };
    }

    return { type: 'text', content: line };
};

export default function MarkdownText({ children}) {
    if (!children) {
        return null;
    }

    const lines = children.split('\n');

    const processedLines = lines.map(processLine);

    const renderLine = (line, index) => {
        switch (line.type) {
            case 'separator':
                return <View key={`separator-${index}`} style={styles.separator} />;
            case 'spacing':
                return <View key={`spacing-${index}`} style={styles.paragraph} />;
            case 'title':
                return <TitleText key={`title-${index}`}>{line.content}</TitleText>;
            case 'subtitle':
                return <BodyBoldText key={`subtitle-${index}`}>{line.content}</BodyBoldText>;
            case 'bullet':
                return (
                    <View key={`bullet-${index}`} style={styles.bulletContainer}>
                        <BodyText style={styles.bulletPoint}>•</BodyText>
                        <BodyText style={styles.bulletText}>{line.content}</BodyText>
                    </View>
                );
            case 'text':
                return <BodyText key={`text-${index}`}>{line.content}</BodyText>;
            default:
                return null;
        }
    };

    return (
        <View>
            {processedLines.map(renderLine)}
        </View>
    );
};

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    bulletContainer: {
        flexDirection: 'row',
    },
    bulletPoint: {
        marginRight: 5,
    },
    bulletText: {
        flex: 1,
    },
    paragraph: {
        marginBottom: 10,
    },
});
