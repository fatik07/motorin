import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from "react-native";
import { useRef, ReactNode } from "react";
import { COLORS, BORDER_WIDTH } from "@constants/theme";

interface SelectionCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    iconBgColor: string;
    selected: boolean;
    onPress: () => void;
}

export default function SelectionCard({
    title,
    description,
    icon,
    iconBgColor,
    selected,
    onPress,
}: SelectionCardProps) {
    const scale = useRef(new Animated.Value(1)).current;

    const animateButton = (toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
                style={[
                    styles.optionCard,
                    selected && styles.optionCardSelected,
                ]}
                onPress={onPress}
                onPressIn={() => animateButton(0.97)}
                onPressOut={() => animateButton(1)}
                activeOpacity={1}
            >
                <View
                    style={[styles.iconBox, { backgroundColor: iconBgColor }]}
                >
                    {icon}
                </View>
                <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{title}</Text>
                    <Text style={styles.optionDescription}>{description}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 20,
        marginBottom: 16,
        shadowColor: COLORS.border,
        shadowOffset: { width: 6, height: 7 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 8,
    },
    optionCardSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.border,
        shadowOffset: { width: 2, height: 2 },
        transform: [{ translateX: 2 }, { translateY: 2 }],
    },
    iconBox: {
        width: 64,
        height: 64,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
});
