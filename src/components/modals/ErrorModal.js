import { colors } from '@styles';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export default function ErrorModal(props) {
    const { message, onHide } = props;

    const slideAnim = useRef(new Animated.Value(-100)).current;
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        let hideTimeout;

        if (message) {
            setIsRendered(true);
            Animated.timing(slideAnim, {
                toValue: 10,
                duration: 300,
                useNativeDriver: false,
            }).start();

            hideTimeout = setTimeout(() => {
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: false,
                }).start(() => {
                    setIsRendered(false);
                    onHide && onHide();
                });
            }, 3000);
        }

        return () => clearTimeout(hideTimeout); // Bezpieczne czyszczenie
    }, [message]);

    if (!isRendered) return null;

    return (
        <>
            {isRendered && (
                <Animated.View style={[styles.toast, { top: slideAnim }]}>
                    <Text style={styles.message}>{message}</Text>
                </Animated.View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: -100, // początkowa pozycja poza ekranem
        left: 10,
        right: 10,
        backgroundColor: colors.darkError,
        padding: 15,
        borderRadius: 8,
        elevation: 5,
    },
    message: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});
