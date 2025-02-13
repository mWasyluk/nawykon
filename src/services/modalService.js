import RootSiblings from 'react-native-root-siblings';
import ErrorModal from '@components/modals/ErrorModal';
import ConfirmationModal from '@components/modals/ConfirmationModal';

let currentSibling = null;

const ModalService = {

    showError(message) {
        currentSibling = new RootSiblings(
            <ErrorModal
                message={message}
                onClose={() => {
                    currentSibling?.destroy();
                    currentSibling = null;
                }}
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

    hide() {
        currentSibling?.destroy();
        currentSibling = null;
    }
};

export default ModalService;
