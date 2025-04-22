import Button from '@components/input/Button';
import { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import TextInput from '@components/input/TextInput';
import { SectionContainer, SectionHeader, SubsectionHeader } from '@components/layout';
import { BodyText, OptionalErrorText, PressableText } from '@components/text';
import { AUTH_VALIDATION_DELAY } from '@constants/time';
import { User } from '@models/user/User';
import { ModalService } from '@services/modalService';
import { UserService } from '@services/userService';
import { colors, icons } from '@styles';
import React, { createRef, useRef, useState } from 'react';
import { Image, Keyboard, TouchableOpacity, View } from 'react-native';

export default function LoginSection({ goToRegister, styles }) {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: undefined,
        password: undefined,
    });

    const [securePassword, setSecurePassword] = useState(true);

    const timerRef = useRef(null);

    const isFormValid = Object.values(errors).every((error) => error === null);
    const buttonVariant = isFormValid ? INPUT_VARIANTS.PRIME : INPUT_VARIANTS.DISABLED;

    const validate = (name, value) => {
        try {
            const validationFunction = User[`validate${name.charAt(0).toUpperCase()}${name.slice(1)}`];
            validationFunction(value);
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
        }, AUTH_VALIDATION_DELAY);
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
                autoComplete: "current-password",
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
        }
    ]

    const inputRefs = useRef(formProps.map(() => createRef()));

    const submitForm = async () => {
        if (!isFormValid) {
            ModalService.showError('Dane konta są nieprawidłowe. Popraw błędy i spróbuj jeszcze raz.');
            return;
        }

        try {
            const { email, password } = values;
            await UserService.login(email, password);
        } catch (err) {
            ModalService.showError(err.message);
        }
    }

    return (
        <SectionContainer style={styles.container}>
            <SectionHeader title={'Logowanie'} />

            <BodyText style={styles.info}>
                {'Wprowadź dane podane przy rejestracji, aby zalogować się do swojego konta.'}
            </BodyText>

            {formProps.map(({ name, headerProps, inputProps, children = <></> }, i) => (
                <React.Fragment key={`login-field-${name}`}>
                    <View>
                        <SubsectionHeader {...headerProps} />
                        <TextInput
                            name={name}
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
                title={"Zaloguj się"}
                icon={icons.plus}
                onPress={submitForm}

                variant={buttonVariant}
                size={INPUT_SIZES.LARGE}
                style={styles.button}
            />

            <View style={styles.multiTextLine}>
                <BodyText style={{ color: colors.midGray }}>
                    {"Nie masz jeszcze konta? "}
                </BodyText>
                <PressableText onPress={goToRegister}>
                    {"Zarejestruj się!"}
                </PressableText>
            </View>
        </SectionContainer>
    );
}
