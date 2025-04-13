import ConfirmationModal from '@components/modals/ConfirmationModal';
import ErrorModal from '@components/modals/ErrorModal';
import InfoModal from '@components/modals/InfoModal';
import MarkdownText from '@components/text/MarkdownText';
import { privacyPolicyMarkdown } from '@constants/privacyPolicy';
import { termsOfServiceMarkdown } from '@constants/termsOfService';
import RootSiblings from 'react-native-root-siblings';

var currentSibling = null;

export const ModalService = {
    showError(message) {
        currentSibling = new RootSiblings(
            <ErrorModal
                message={message}
                noHide={() => { currentSibling = null }}
            />
        );
    },

    showConfirm(message, onConfirm = () => { }, onCancel = () => { }) {
        currentSibling = new RootSiblings(
            <ConfirmationModal
                visible={true}
                message={message}
                onConfirm={() => {
                    onConfirm();
                    currentSibling?.destroy();
                    currentSibling = null;
                }}
                onCancel={() => {
                    onCancel();
                    currentSibling?.destroy();
                    currentSibling = null;
                }}
            />
        );
    },

    showInfo(title, content) {
        currentSibling = new RootSiblings(
            <InfoModal
                title={title}
                content={content}
                onClose={() => {
                    currentSibling?.destroy();
                    currentSibling = null;
                }}
            />
        );
    },

    showPrivacyPolicy() {
        const content = <MarkdownText>{privacyPolicyMarkdown}</MarkdownText>

        ModalService.showInfo('Polityka prywatności', content);
    },

    showTermsOfService() {
        const content = <MarkdownText>{termsOfServiceMarkdown}</MarkdownText>;

        ModalService.showInfo('Regulamin użytkowania', content);
    }
};
