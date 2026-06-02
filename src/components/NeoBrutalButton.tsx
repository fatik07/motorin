import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";

interface NeoBrutalButtonProps {
    onPress: () => void;
    title: string;
    variant?: "primary" | "secondary";
    disabled?: boolean;
}

export default function NeoBrutalButton({
    onPress,
    title,
    variant = "primary",
    disabled = false,
}: NeoBrutalButtonProps) {
    const backgroundColor =
        variant === "primary" ? COLORS.primary : COLORS.surface;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
            style={[
                styles.button,
                {
                    backgroundColor,
                    opacity: disabled ? 0.5 : 1,
                },
            ]}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        textAlign: "center",
    },
});
