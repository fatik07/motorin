import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { COLORS, BORDER_WIDTH } from "@constants/theme";
import { ReactNode } from "react";

interface NeoBrutalCardProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}

export default function NeoBrutalCard({ children, style }: NeoBrutalCardProps) {
    return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 24,
        shadowColor: COLORS.border,
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    },
});
