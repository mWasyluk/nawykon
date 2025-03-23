import { useUser } from '@contexts/UserContext';
import { colors } from '@styles';
import { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, View } from 'react-native';
import LoginSection from './LoginSection';
import RegisterSection from './RegisterSection';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AuthScreen() {
    const { login } = useUser();
    const [isLogin, setIsLogin] = useState(true);

    const formsOffsetX = useRef(new Animated.Value(0)).current;

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
