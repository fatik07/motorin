import { View, Text, StyleSheet } from "react-native";
import LogoImage from "./LogoImage";
import { COLORS, BORDER_WIDTH } from "@constants/theme";

interface TabsHeaderProps {
    title?: string;
}

export default function TabsHeader({ title = "Dashboard" }: TabsHeaderProps) {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <LogoImage size="small" containerStyle={styles.logo} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 5,
        backgroundColor: COLORS.background,
        borderBottomWidth: BORDER_WIDTH.thin,
        borderBottomColor: COLORS.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        color: COLORS.textPrimary,
        letterSpacing: -0.4,
    },
    logo: {
        width: 82,
        aspectRatio: 16 / 9,
    },
});
