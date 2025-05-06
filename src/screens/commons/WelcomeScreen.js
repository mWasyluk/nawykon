import BlurredBackground from "@components/effects/BlurredBackground"
import Button from "@components/input/Button"
import { INPUT_VARIANTS } from "@components/input/InputContainer"
import Switch from "@components/input/Switch"
import { ScreenContainer } from "@components/layout"
import { BodyBoldText, BodyText, PressableText } from "@components/text"
import { ModalService } from "@services/modalService"
import { colors, metrics } from "@styles"
import { useState } from "react"
import { Animated, Dimensions, Image, Platform, StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const tabs = [{
    imgSrc: require("@assets/welcome/welcome-habits.png"),
    description: "Codzienne nawyki to Twoja droga do sukcesu. Wyznaczaj cele i realizuj je krok po kroku ciesząc się postępami.",
}, {
    imgSrc: require("@assets/welcome/welcome-reports.png"),
    description: "Samopoczucie pod kontrolą to podstawa równowagi. Śledź swoje emocje i energię każdego dnia, odkrywając wzorce Twojego nastroju.",
}, {
    imgSrc: require("@assets/welcome/welcome-charts.png"),
    description: "Wizualizacja postępu napawa motywacją. Obserwuj wykresy swoich aktywności i analizuj statystyki, by utrzymać postęp.",
}, {
    imgSrc: require("@assets/welcome/welcome-regulations.png"),
    description: "Świadome decyzje dają poczucie kontroli. Zapoznaj się, a następnie zaakceptuj wymagane regulacje, aby przejść dalej.",
}];

const WelcomeScreen = ({ onSkip = () => { } }) => {
    const insets = useSafeAreaInsets();
    const [regulationsAccepted, setRegulationsAccepted] = useState(false);
    const [activeTabIndex, setActiveTab] = useState(0);
    const slideAnim = useState(new Animated.Value(0))[0];

    const activeTab = tabs[activeTabIndex];
    const isLastTab = activeTabIndex === tabs.length - 1;
    const buttonVariant = (!isLastTab || regulationsAccepted) ? INPUT_VARIANTS.PRIME : INPUT_VARIANTS.DISABLED;

    const { width } = Dimensions.get('window');

    const handleSkip = () => {
        if (!isLastTab) {
            Animated.timing(slideAnim, {
                toValue: -width,
                duration: 300,
                useNativeDriver: Platform.OS !== 'web',
            }).start(() => {
                slideAnim.setValue(width);
                setActiveTab(activeTabIndex + 1);
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: Platform.OS !== 'web',
                }).start();
            });

            return;
        }
        if (regulationsAccepted) {
            onSkip();
        }
    }

    return (
        <ScreenContainer style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom + metrics.spacing.md }}>
            <Image style={styles.logoImage}
                source={require("@assets/images/logo.png")}
                resizeMode='contain'
            />

            <View style={styles.backgroundCircleContainer}>
                <BlurredBackground color={`${colors.darkBlue}22`} shape={"circle"} blurRadius={8} />
            </View>

            <Animated.View
                style={[
                    styles.contentContainer,
                    { transform: [{ translateX: slideAnim }] }
                ]}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={activeTab.imgSrc}
                        resizeMode='contain'
                        style={styles.image}
                    />
                </View>

                <BodyBoldText style={styles.descriptionText}>
                    {activeTab.description}
                </BodyBoldText>

                {isLastTab && (
                    <View style={styles.switchContainer}>
                        <Switch
                            isOn={regulationsAccepted}
                            onChange={setRegulationsAccepted}
                        />
                        <View style={styles.regulationTextContainer}>
                            <BodyText>{"Akceptuję "}</BodyText>
                            <PressableText style={styles.regulationTextButton} onPress={ModalService.showTermsOfService}>
                                {"regulamin użytkowania"}
                            </PressableText>
                            <BodyText>{" i "}</BodyText>
                            <PressableText style={styles.regulationTextButton} onPress={ModalService.showPrivacyPolicy}>
                                {"politykę prywatności"}
                            </PressableText>
                            <BodyText>{"."}</BodyText>
                        </View>
                    </View>
                )}
            </Animated.View>

            <View style={styles.tabIndicatorsContainer}>
                {Array.from({ length: tabs.length }).map((_, index) => (
                    <View key={index} style={{
                        width: 15,
                        height: 15,
                        borderRadius: metrics.borderRadius.circular,
                        backgroundColor: index < activeTabIndex ? colors.darkBlue : index === activeTabIndex ? colors.primBlue : colors.lightGray,
                        marginHorizontal: 2,
                    }} />
                ))}
            </View>

            <Button
                title={"Przejdź dalej"}
                variant={buttonVariant}
                onPress={handleSkip}
                style={{ alignSelf: 'center' }}
            />
        </ScreenContainer>
    )
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    logoImage: {
        marginVertical: metrics.spacing.md,
        width: '100%',
        height: 40,
    },
    backgroundCircleContainer: {
        position: 'absolute',
        width: '130%',
        aspectRatio: 1,
        alignSelf: 'center',
        top: '50%',
        transform: [{ translateY: Platform.OS === 'web' ? '-50%' : '-40%' }],
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: metrics.spacing.md,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 2,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%'
    },
    descriptionText: {
        marginTop: metrics.spacing.sm,
        textAlign: "center",
        color: colors.darkGray,
    },
    switchContainer: {
        flexDirection: "row",
        marginTop: metrics.spacing.sm,
        width: '100%',
        alignItems: "center",
        gap: metrics.spacing.xs,
    },
    regulationTextContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    regulationTextButton: {
        textDecorationLine: "underline",
        textTransform: 'none',
        color: colors.darkBlue,
    },
    tabIndicatorsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: metrics.spacing.sm,
    },
});
