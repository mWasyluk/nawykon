import { TitleText } from '@components/text';
import { MODAL_ANIMATION_DURATION } from '@constants/time';
import { colors, icons, metrics, uiStyles } from '@styles';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { height } = Dimensions.get('window');
const paddingVertical = metrics.spacing.md;
const paddingHorizontal = metrics.spacing.sm;

export default function InfoModal(props) {
    const { title, content, onClose } = props;
    const slideAnim = useRef(new Animated.Value(height)).current;

    const handleHide = () => {
        Animated.timing(slideAnim, {
            toValue: height,
            duration: MODAL_ANIMATION_DURATION,
            useNativeDriver: Platform.OS !== 'web',
        }).start(() => {
            onClose();
        });
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: MODAL_ANIMATION_DURATION,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
    }, []);

    return (
        <Modal transparent visible={true} animationType="none">
            <View style={styles.overlay}>
                <Pressable style={styles.background} onPress={handleHide} />

                <Animated.View style={[styles.modal, { translateY: slideAnim }]}>
                    <View style={styles.titleRow}>
                        <TitleText>{title}</TitleText>
                        <TouchableOpacity onPress={handleHide}>
                            <Image source={icons.cancel} style={styles.closeIcon} tintColor={colors.darkGray} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {content}
                    </ScrollView>
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
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        position: 'absolute',
        left: paddingHorizontal,
        right: paddingHorizontal,
        padding: metrics.spacing.sm,
        maxHeight: height - paddingVertical * 2,

        overflow: 'hidden',
        backgroundColor: colors.light,
        borderRadius: metrics.borderRadius.sm,
        ...uiStyles.lightShadow,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    closeIcon: {
        height: metrics.imageSize.xs,
        width: metrics.imageSize.xs,
        padding: metrics.spacing.xs,
    },
});
