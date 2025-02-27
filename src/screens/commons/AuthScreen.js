import { colors } from '@styles';
import { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, View } from 'react-native';
import { useUser } from '@contexts/UserContext';
import LoginSection from '@screens/commons/sections/LoginSection';
import RegisterSection from '@screens/commons/sections/RegisterSection';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// const LOTTIE_INITIAL_WIDTH = 200;
// const LOTTIE_SHRINK_WIDTH = 150;
// const LOTTIE_INITIAL_Y = SCREEN_HEIGHT / 2 - LOTTIE_INITIAL_WIDTH;
// const LOTTIE_FINAL_Y = 100;

/**
 * 1) LottieView is always visible. 
 *    - During loading, it is placed above center and animates.
 *    - After loading, it is paused, shrinks by 50px, and is positioned at 100px from top.
 *
 * 2) The message is in the center. It fades out when the auth section appears.
 *
 * 3) showMessage: fade in the message, put Lottie in "loading" position (animate / big size).
 * 4) showAuth: fade out message, pause Lottie animation, move it to top=100, shrink width, 
 *    and slide auth container from the bottom to about half screen.
 *
 * 5) switchAuth: shift the forms horizontally (0 => login is visible, -SCREEN_WIDTH => register is visible).
 */
export default function AuthScreen(props) {
    // const { login = () => { } } = props;
    const { login } = useUser();
    const [isLogin, setIsLogin] = useState(true);

    // Animated values
    const formsOffsetX = useRef(new Animated.Value(0)).current;


    // Shift horizontally between Login (offset=0) and Register (offset=-SCREEN_WIDTH)
    const switchAuth = () => {
        const target = isLogin ? -SCREEN_WIDTH : 0;
        Animated.timing(formsOffsetX, {
            toValue: target,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            setIsLogin(!isLogin);
        });
    };

    return (
        <View style={styles.container}>
            <Image style={styles.image}
                source={require("@assets/images/logo.png")}
                resizeMode='contain'
            />

            {/* <Animated.View
                    style={[
                        styles.authContainer,
                        { transform: [{ translateY: authTranslateY }] },
                    ]}
                > */}
            {/* Horizontal layout for login & register */}
            <Animated.View
                style={[
                    styles.formsRow,
                    { transform: [{ translateX: formsOffsetX }] },
                ]}
            >
                <View style={[styles.authSection]}>
                    <LoginSection
                        login={login}
                        goToRegister={switchAuth}
                    />
                </View>
                <View style={[styles.authSection]}>
                    <RegisterSection onGoToLogin={switchAuth} />
                </View>
            </Animated.View>
            {/* </Animated.View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
    },

    image: {
        marginTop: 40,
        width: '100%',
        height: 50,
    },

    formsRow: {
        flexDirection: 'row',
        width: SCREEN_WIDTH * 2,
    },

    authSection: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
