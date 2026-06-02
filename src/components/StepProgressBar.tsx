import { View, Text, StyleSheet } from "react-native";
import { COLORS, BORDER_WIDTH } from "@constants/theme";

interface StepProgressBarProps {
    currentStep: number;
    totalSteps: number;
    labelPrefix?: string;
}

export default function StepProgressBar({
    currentStep,
    totalSteps,
    labelPrefix = "LANGKAH",
}: StepProgressBarProps) {
    const percentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>
                    {labelPrefix} {currentStep}/{totalSteps}
                </Text>
                <Text style={styles.progressPercentage}>{percentage}%</Text>
            </View>
            <View style={styles.progressBar}>
                <View
                    style={[styles.progressFill, { width: `${percentage}%` }]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    progressSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#92400e",
        letterSpacing: 0.5,
    },
    progressPercentage: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    progressBar: {
        height: 12,
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        overflow: "hidden",
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    progressFill: {
        height: "100%",
        backgroundColor: COLORS.primary,
    },
});
