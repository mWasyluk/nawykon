import ErrorModal from '@components/modals/ErrorModal';
import React, { createContext, useContext, useState } from 'react';

const ErrorContext = createContext();

export const useError = () => {
    return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
    const [errorMessage, setErrorMessage] = useState('');

    const showError = (message) => {
        setErrorMessage(message);
    };

    const hideError = () => {
        setErrorMessage('');
    };

    return (
        <ErrorContext.Provider value={{ showError, hideError }}>
            {children}
            {errorMessage && (
                <ErrorModal
                    message={errorMessage}
                    onHide={hideError}
                />
            )}
        </ErrorContext.Provider>
    );
};
