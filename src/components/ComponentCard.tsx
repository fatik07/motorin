import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ComponentWithStatus } from "../types";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import { getStatusColor, getStatusText, getProgressColor } from "@utils/componentStatus";

interface ComponentCardProps {
    component: ComponentWithStatus;
    onPress?: () => void;
    compact?: boolean;
}

export default function ComponentCard({
    component,
    onPress,
    compact = false,
}: ComponentCardProps) {
    const statusColor = getStatusColor(component.status);
    const progressColor = getProgressColor(component.status);
    const statusText = getStatusText(component.remainingKm);

    const CardContainer = onPress ? TouchableOpacity : View;

    return (
        <CardContainer
            onPress={onPress}
            style={[
                styles.card,
                compact && styles.compactCard,
                {
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.surface,
                },
            ]}
        >
            <View style={[styles.header, compact && styles.compactHeader]}>
                <Text
                    style={[
                        styles.componentName,
                        compact && styles.compactComponentName,
                    ]}
                    numberOfLines={1}
                >
                    {component.name}
                </Text>
                <View
                    style={[
                        styles.statusBadge,
                        compact && styles.compactStatusBadge,
                        {
                            backgroundColor: statusColor,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            compact && styles.compactStatusText,
                        ]}
                        numberOfLines={1}
                    >
                        {statusText}
                    </Text>
                </View>
            </View>

            <View
                style={[
                    styles.progressContainer,
                    compact && styles.compactProgressContainer,
                ]}
            >
                <View
                    style={[
                        styles.progressBarBackground,
                        compact && styles.compactProgressBarBackground,
                    ]}
                >
                    <View
                        style={[
                            styles.progressBarFill,
                            {
                                width: `${Math.min(100, component.progressPercentage)}%`,
                                backgroundColor: progressColor,
                            },
                        ]}
                    />
                </View>
            </View>
        </CardContainer>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderWidth: BORDER_WIDTH.thick,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
        marginBottom: 16,
    },
    compactCard: {
        width: "48%",
        marginBottom: 12,
        padding: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    compactHeader: {
        marginBottom: 8,
        alignItems: "flex-start",
        gap: 8,
    },
    componentName: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        flex: 1,
    },
    compactComponentName: {
        fontSize: 14,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
    },
    compactStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    compactStatusText: {
        fontSize: 10,
    },
    progressContainer: {
        marginTop: 8,
    },
    compactProgressContainer: {
        marginTop: 4,
    },
    progressBarBackground: {
        height: 12,
        backgroundColor: "#E5E7EB",
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        overflow: "hidden",
    },
    compactProgressBarBackground: {
        height: 10,
    },
    progressBarFill: {
        height: "100%",
    },
});
