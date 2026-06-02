import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from "react-native";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { COLORS, BORDER_WIDTH } from "@constants/theme";

interface StepFooterProps {
    onBack?: () => void;
    onNext: () => void;
    backLabel?: string;
    nextLabel?: string;
    nextDisabled?: boolean;
    showNextIcon?: boolean;
}

export default function StepFooter({
    onBack,
    onNext,
    backLabel = "BACK",
    nextLabel = "LANJUT",
    nextDisabled = false,
    showNextIcon = true,
}: StepFooterProps) {
    const backButtonScale = useRef(new Animated.Value(1)).current;
    const nextButtonScale = useRef(new Animated.Value(1)).current;

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    return (
        <View style={styles.footer}>
            {onBack && (
                <Animated.View
                    style={{ flex: 1, transform: [{ scale: backButtonScale }] }}
                >
                    <TouchableOpacity
                        onPress={onBack}
                        onPressIn={() => animateButton(backButtonScale, 0.95)}
                        onPressOut={() => animateButton(backButtonScale, 1)}
                        style={styles.backButton}
                        activeOpacity={1}
                    >
                        <ArrowLeft
                            size={20}
                            color={COLORS.textPrimary}
                            strokeWidth={2.5}
                        />
                        <Text style={styles.backButtonText}>{backLabel}</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            <Animated.View
                style={{
                    flex: onBack ? 2 : 1,
                    transform: [{ scale: nextButtonScale }],
                }}
            >
                <TouchableOpacity
                    onPress={onNext}
                    onPressIn={() => animateButton(nextButtonScale, 0.95)}
                    onPressOut={() => animateButton(nextButtonScale, 1)}
                    style={[
                        styles.nextButton,
                        nextDisabled && styles.buttonDisabled,
                    ]}
                    activeOpacity={1}
                    disabled={nextDisabled}
                >
                    <Text style={styles.nextButtonText}>{nextLabel}</Text>
                    {showNextIcon && (
                        <ArrowRight
                            size={20}
                            color={COLORS.textPrimary}
                            strokeWidth={2.5}
                        />
                    )}
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 40,
        flexDirection: "row",
        gap: 12,
        backgroundColor: COLORS.background,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 16,
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    nextButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 16,
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: "#e5e7eb",
    },
});
