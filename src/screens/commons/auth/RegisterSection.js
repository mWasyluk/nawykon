import Button from '@components/input/Button';
import { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import TextInput from '@components/input/TextInput';
import { SectionContainer, SectionHeader, SubsectionHeader } from '@components/layout';
import { BodyText, OptionalErrorText, PressableText } from '@components/text';
import { User } from '@models/user/User';
import { ModalService } from '@services/modalService';
import { colors, icons } from '@styles';
import React, { createRef, useRef, useState } from 'react';
import { Image, Keyboard, TouchableOpacity, View } from 'react-native';
import { VALIDATION_DELAY } from './AuthScreen';

function validatePasswordConfirmation(password, passwordConfirmation) {
    if (password !== passwordConfirmation) {
        throw new Error('Hasła nie są takie same.');
    }
}

export default function RegisterSection({ register, goToLogin, styles }) {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });

    const [errors, setErrors] = useState({
        username: undefined,
        email: undefined,
        password: undefined,
        passwordConfirmation: undefined,
    });

    const [securePassword, setSecurePassword] = useState(true);

    const timerRef = useRef(null);

    const isFormValid = Object.values(errors).every((error) => error === null);
    const buttonVariant = isFormValid ? INPUT_VARIANTS.PRIME : INPUT_VARIANTS.DISABLED;

    const validate = (name, value) => {
        try {
            if (name === 'passwordConfirmation') {
                validatePasswordConfirmation(values.password, value);
            } else {
                const validationFunction = User[`validate${name.charAt(0).toUpperCase()}${name.slice(1)}`];
                validationFunction(value);
            }
            setErrors({ ...errors, [name]: null });
        } catch (error) {
            setErrors({ ...errors, [name]: error.message });
        }
    };

    const handleChange = (name, value) => {
        setValues({ ...values, [name]: value });
        setErrors({ ...errors, [name]: undefined });

        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            validate(name, value);
        }, VALIDATION_DELAY);
    };

    const handleInputSubmit = (i) => {
        const inputName = formProps[i].name;
        validate(inputName, values[inputName]);

        const target = inputRefs.current[i + 1]?.current;
        if (target) {
            target.focus();
        } else {
            Keyboard.dismiss();
        }
    };

    const formProps = [
        {
            name: 'username',
            headerProps: {
                title: "Imię",
                isRequired: true,
            },
            inputProps: {
                inputMode: "text",
                autoComplete: "given-name",
            },
        }, {
            name: 'email',
            headerProps: {
                title: "E-mail",
                isRequired: true,
            },
            inputProps: {
                inputMode: "email",
                autoComplete: "email",
                importantForAutofill: "yes",
                autoCapitalize: "none",
            },
        }, {
            name: 'password',
            headerProps: {
                title: "Hasło",
                isRequired: true,
            },
            inputProps: {
                inputMode: "text",
                autoComplete: "new-password",
                secureTextEntry: securePassword,
                importantForAutofill: "yes",
                autoCapitalize: "none",
            },
            children: (
                <TouchableOpacity
                    onPress={() => setSecurePassword(!securePassword)}
                    style={styles.securePasswordContainer}
                >
                    <Image
                        source={securePassword ? icons.eye : icons.eyeCrossed}
                        style={styles.passwordIcon}
                        tintColor={styles.passwordIcon.color}
                    />
                </TouchableOpacity>
            ),
        }, {
            name: 'passwordConfirmation',
            headerProps: {
                title: "Powtórz hasło",
                isRequired: true,
            },
            inputProps: {
                inputMode: "text",
                autoComplete: "new-password",
                secureTextEntry: true,
                importantForAutofill: "yes",
                autoCapitalize: "none",
            },
        }
    ]

    const inputRefs = useRef(formProps.map(() => createRef()));

    const submitForm = async () => {
        if (!isFormValid) {
            ModalService.showError('Dane konta są nieprawidłowe. Popraw błędy i spróbuj jeszcze raz.');
            return;
        }

        try {
            const { username, email, password } = values;
            await register({ username, email, password });
        } catch (error) {
            ModalService.showError('Nie mogłem Cię zarejestrować. Sprawdź wprowadzone dane i spróbuj jeszcze raz.');
        }
    }

    return (
        <SectionContainer style={styles.container}>
            <SectionHeader title={'Rejestracja'} />

            <BodyText style={styles.info}>
                {'Poniższe dane są niezbędne do zabezpieczenia informacji o Tobie przed nieautoryzowanym dostępem. Postaraj się, aby były unikalne.'}
            </BodyText>

            {formProps.map(({ name, headerProps, inputProps, children = <></> }, i) => (
                <React.Fragment key={`register-form-${name}`}>
                    <View>
                        <SubsectionHeader {...headerProps} />
                        <TextInput
                            value={values[name]}
                            onChange={(value) => handleChange(name, value)}
                            error={errors[name]}
                            onBlur={() => validate(name, values[name])}

                            enterKeyHint={i === formProps.length - 1 ? "done" : "next"}
                            outerRef={inputRefs.current[i]}
                            blurOnSubmit={false}
                            onSubmitEditing={() => handleInputSubmit(i)}
                            {...inputProps}
                        />
                        {children}
                    </View>
                    <OptionalErrorText>{errors[name]}</OptionalErrorText>
                </React.Fragment>
            ))}

            <Button
                title={"Zarejestruj się"}
                icon={icons.plus}
                onPress={submitForm}

                variant={buttonVariant}
                size={INPUT_SIZES.LARGE}
                style={styles.button}
            />

            <View style={styles.multiTextLine}>
                <BodyText style={{ color: colors.midGray }}>
                    {"Masz już konto? "}
                </BodyText>
                <PressableText onPress={goToLogin}>
                    {"Zaloguj się!"}
                </PressableText>
            </View>
        </SectionContainer>
    );
}
