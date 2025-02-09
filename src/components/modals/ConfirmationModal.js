import Button from '@components/ui/Button';
import { colors, icons } from '@styles';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View, Text, StyleSheet, Dimensions, Modal } from 'react-native';

const { height } = Dimensions.get('window');

export default function ConfirmationModal(props) {
    const { visible, message, onConfirm, onCancel } = props;
    const slideAnim = useRef(new Animated.Value(height)).current;
    const [isRendered, setIsRendered] = useState(visible);

    useEffect(() => {
        if (visible) {
            setIsRendered(true);
            Animated.timing(slideAnim, {
                toValue: height / 2 - 50,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else if (isRendered) {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setIsRendered(false));
        }
    }, [visible]);

    if (!isRendered) return null;

    return (
        <Modal transparent visible={isRendered} animationType="none">
            <View style={styles.overlay}>
                <Pressable style={styles.background} onPress={onCancel} />

                <Animated.View style={[styles.modal, { top: slideAnim }]}>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Anuluj"
                            icons={icons.cancel}
                            onPress={onCancel}
                            prim={false}
                            small={true}
                            style={{ marginRight: 10 }}
                        />
                        <Button
                            title="Zatwierdź"
                            icons={icons.check}
                            onPress={onConfirm}
                            prim={true}
                            small={true}
                        />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
    },
    background: {
        ...StyleSheet.absoluteFillObject, // zapewnia pełnoekranowe pokrycie
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        position: 'absolute',
        left: 10,
        right: 10,
        backgroundColor: colors.light,
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
