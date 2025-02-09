import ConfirmationModal from '@components/modals/ConfirmationModal';
import ErrorModal from '@components/modals/ErrorModal';
import { createContext, useCallback, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmation, setConfirmation] = useState(null);

    const showError = useCallback((message) => {
        setErrorMessage('');
        setTimeout(() => setErrorMessage(message), 50);
    }, []);

    const hideError = () => {
        setErrorMessage('');
    };

    const showConfirm = useCallback((message, onConfirm = () => { }, onCancel = () => { }) => {
        if (!message) {
            throw new Error('Cannot show confirmation without a message');
        }
        setConfirmation({ message, onConfirm, onCancel });
    }, []);

    const approveConfirmation = () => {
        confirmation.onConfirm();
        setConfirmation(null);
    };

    const cancelConfirmation = () => {
        confirmation.onCancel();
        setConfirmation(null);
    };

    return (
        <ModalContext.Provider value={{ showError, showConfirm }}>
            {children}
            {errorMessage && (
                <ErrorModal
                    key={errorMessage}
                    message={errorMessage}
                    onHide={hideError}
                />
            )}
            {confirmation && (
                <ConfirmationModal
                    visible={true}
                    message={confirmation.message}
                    onConfirm={approveConfirmation}
                    onCancel={cancelConfirmation}
                />
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
