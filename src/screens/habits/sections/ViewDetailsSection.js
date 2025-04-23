import HabitAvatar from '@components/habit/HabitAvatar';
import Button from '@components/input/Button';
import InputContainer, { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import { SectionContainer, SectionHeader } from '@components/layout';
import { CaptionText, LabelText, TitleText } from '@components/text';
import routes from '@constants/router';
import { useHabits } from '@contexts/HabitsContext';
import { ModalService } from '@services/modalService';
import { colors, icons, metrics } from '@styles';
import { formatDate } from '@utils/dateUtil';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

const ANIMATION_DURATION = 300;
const BUTTON_CONTAINER_HEIGHT = metrics.buttonSize.sm;

export default function ViewDetailsSection({ habit }) {
    const {
        id,
        createdAt,
        endDate,
    } = habit;

    const {
        name,
        description,
        type,
        color,
    } = habit.details;

    const {
        repetitions,
    } = habit.goal;

    const days = habit.goal.days.length;

    const { deleteHabit } = useHabits();
    const [isExpanded, setIsExpanded] = useState(false);
    const slideAnimation = useRef(new Animated.Value(0)).current;

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        Animated.timing(slideAnimation, {
            toValue: isExpanded ? 1 : 0,
            duration: ANIMATION_DURATION,
            useNativeDriver: false,
        }).start();
    }, [isExpanded, slideAnimation]);

    const animatedButtonContainerStyle = {
        height: slideAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, BUTTON_CONTAINER_HEIGHT]
        }),
        marginTop: slideAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [-metrics.spacing.sm, 0]
        }),
        opacity: slideAnimation
    };

    const handleDeletePress = () => {
        const message = `Czy chcesz trwale usunąć nawyk "${name}"?`;
        const onConfirm = async () => {
            await deleteHabit(id);
            router.replace(routes.home);
        };
        ModalService.showConfirm(message, onConfirm);
    }

    const handleEditPress = () => {
        router.push(routes.editHabit(id));
    }

    const endDateColor = endDate && endDate < formatDate(new Date(), 'date') ? colors.lightError : styles.captionText.color;

    return (
        <SectionContainer>
            <SectionHeader title="Szczegóły" />
            <InputContainer
                size={INPUT_SIZES.AUTO}
                style={styles.container}
                onPress={toggleExpansion}
            >
                <HabitAvatar type={type} color={color} />
                <View style={styles.textContainer}>
                    <TitleText style={styles.mainText}>{name}</TitleText>
                    <CaptionText style={styles.captionText}>{description}</CaptionText>
                </View>

                <View>
                    <View style={styles.detailsContainer}>
                        <LabelText style={styles.captionText}>{formatDate(createdAt, 'date')}</LabelText>
                        <Image source={icons.calendarCheck} style={styles.detailsIcon} tintColor={styles.captionText.color} />
                    </View>

                    {endDate && (
                        <View style={styles.detailsContainer}>
                            <LabelText style={[styles.captionText, { color: endDateColor }]}>{endDate}</LabelText>
                            <Image source={icons.calendarCross} style={styles.detailsIcon} tintColor={endDateColor} />
                        </View>
                    )}

                    <View style={[styles.detailsContainer, { gap: metrics.spacing.sm }]}>
                        <View style={styles.detailsContainer}>
                            <LabelText style={styles.captionText}>{repetitions}</LabelText>
                            <Image source={icons.refresh} style={styles.detailsIcon} tintColor={styles.captionText.color} />
                        </View>

                        <View style={styles.detailsContainer}>
                            <LabelText style={styles.captionText}>{days}</LabelText>
                            <Image source={icons.calendarDays} style={styles.detailsIcon} tintColor={styles.captionText.color} />
                        </View>
                    </View>
                </View>
            </InputContainer>

            <Animated.View style={[styles.buttonContainer, animatedButtonContainerStyle]}>
                <Button
                    icon={icons.pen}
                    title="Edytuj"
                    variant={INPUT_VARIANTS.PRIME}
                    onPress={handleEditPress}
                />
                <Button
                    icon={icons.bin}
                    small={true}
                    variant={INPUT_VARIANTS.ERROR}
                    onPress={handleDeletePress}
                />
            </Animated.View>
        </SectionContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
    },
    mainText: {
        color: colors.darkGray,
    },
    captionText: {
        color: colors.midGray,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: metrics.spacing.xs,
    },
    detailsIcon: {
        width: metrics.imageSize.xs,
        height: metrics.imageSize.xs,
    },
    buttonContainer: {
        zIndex: -1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
});
