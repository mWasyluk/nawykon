import { BodyBoldText } from '@components/text';
import { colors } from '@styles';
import Constants from 'expo-constants';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = 200;
export const LOADING_ANIMATION_DURATION = 500;

export default function LoadingScreen({ show, message }) {
    const [isVisible, setIsVisible] = useState(true);

    const messageOpacity = useRef(new Animated.Value(1)).current;
    const iconLayerTranslateX = useRef(new Animated.Value(0)).current;
    const shadowLayerOpacity = useRef(new Animated.Value(1)).current;

    // fades in the loading message
    const showMessageAnimation = Animated.timing(messageOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
    });

    // fades out the loading message
    const hideMessageAnimation = Animated.timing(messageOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
    });

    // pulls the icon layer from the left edge of the screen
    const showIconLayerAnimation = Animated.timing(iconLayerTranslateX, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
    });

    // pushes the icon layer out of the left edge of the screen
    const hideIconLayerAnimation = Animated.timing(iconLayerTranslateX, {
        toValue: -SCREEN_WIDTH,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
    });

    // fades in the shadow layer
    const showShadowLayerAnimation = Animated.timing(shadowLayerOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
    });

    // fades out the shadow layer
    const hideShadowLayerAnimation = Animated.timing(shadowLayerOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
    });

    const showLoading = () => {
        setIsVisible(true);

        Animated.parallel([
            showIconLayerAnimation,
            showShadowLayerAnimation,
        ]).start(() => {
            showMessageAnimation.start();
        });
    }

    const hideLoading = () => {
        hideMessageAnimation.start(() => {
            Animated.parallel([
                hideIconLayerAnimation,
                hideShadowLayerAnimation,
            ]).start(() => {
                setIsVisible(false);
            });
        });
    }

    useEffect(() => {
        var timer = null;

        if (show) {
            showLoading();
        } else {
            timer = setTimeout(() => {
                hideLoading();
            }, 500);
        }

        return () => clearTimeout(timer);
    }, [show]);

    const hideSplashScreen = useCallback(async () => {
        await ExpoSplashScreen.hideAsync();
    }, []);

    return (
        <>
            <Animated.View
                style={[
                    styles.iconLayer,
                    { transform: [{ translateX: iconLayerTranslateX }] }
                ]}
            >
                {/* loading message */}
                <Animated.View style={{ opacity: messageOpacity, height: 20 }}>
                    <BodyBoldText>{message}</BodyBoldText>
                </Animated.View>

                {/* logo image */}
                <Image style={styles.image}
                    resizeMode={Constants.expoConfig?.splash?.resizeMode || "contain"}
                    source={require("@assets/images/icon.png")}
                    onLoadEnd={hideSplashScreen}
                    fadeDuration={0}
                />

                {/* loading message counterweight */}
                <BodyBoldText style={{ height: 20 }}></BodyBoldText>
            </Animated.View >

            {/* background shadow layer */}
            {isVisible &&
                <Animated.View style={[styles.shadowLayer, { opacity: shadowLayerOpacity }]}></Animated.View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    iconLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,

        flex: 1,
        backgroundColor: colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    shadowLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        zIndex: 999,
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },
});
