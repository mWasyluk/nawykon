import { ScreenContainer } from '@components/layout';
import { colors, metrics, uiStyles } from '@styles';
import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import LoginSection from './LoginSection';
import RegisterSection from './RegisterSection';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);

    const switchAuth = () => {
        setIsLogin(!isLogin);
    };

    return (
        <ScreenContainer>
            <Image style={styles.image}
                source={require("@assets/images/logo.png")}
                resizeMode='contain'
            />

            {isLogin ? (
                <LoginSection
                    goToRegister={switchAuth}
                    styles={sectionStyles}
                />
            ) : (
                <RegisterSection
                    goToLogin={switchAuth}
                    styles={sectionStyles}
                />
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    image: {
        marginVertical: metrics.spacing.xl,
        width: '100%',
        height: 50,
    },
});

const sectionStyles = StyleSheet.create({
    container: {
        marginHorizontal: metrics.spacing.md,
        padding: metrics.spacing.sm,
        paddingBottom: metrics.spacing.md,

        borderRadius: metrics.borderRadius.sm,
        backgroundColor: colors.modalBackground,
        ...uiStyles.lightShadow,
    },
    info: {
        color: colors.midGray,
        marginBottom: metrics.spacing.xl,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
    },
    multiTextLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    securePasswordContainer: {
        zIndex: 1,
        position: 'absolute',
        padding: metrics.spacing.xs,
        right: metrics.spacing.xs,
        bottom: metrics.buttonSize.sm / 2 - metrics.imageSize.xs / 2 - metrics.spacing.xs,
    },
    passwordIcon: {
        width: metrics.imageSize.xs,
        height: metrics.imageSize.xs,
        color: colors.midGray,
    },
    button: {
        alignSelf: 'center',
        marginTop: metrics.spacing.md,
    }
});
