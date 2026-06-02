import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import LogoImage from "@components/LogoImage";

export default function IndexScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        // Fade in animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate to onboarding after 2.5 seconds
        const timer = setTimeout(() => {
            router.replace("/onboarding");
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Main Logo - Image */}
                <LogoImage
                    size="medium"
                    containerStyle={{ marginBottom: 32 }}
                />
            </Animated.View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.divider} />
                <View style={styles.footerInfo}>
                    <Text style={styles.copyright}>©2026 MOTORIN CORP.</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: "space-between",
        paddingVertical: 60,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    logoContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: -20,
    },
    iconBox: {
        width: 80,
        height: 80,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    iconBoxYellow: {
        backgroundColor: COLORS.primary,
    },
    iconBoxWhite: {
        backgroundColor: COLORS.surface,
    },
    logoUnderline: {
        position: "absolute",
        bottom: 12,
        left: 24,
        right: 24,
        height: 6,
        backgroundColor: COLORS.primary,
        marginBottom: 16,
    },
    tagline: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textSecondary,
        letterSpacing: 2,
        marginTop: 8,
    },
    footer: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    divider: {
        width: 80,
        height: 4,
        backgroundColor: COLORS.textPrimary,
        marginBottom: 16,
    },
    footerTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textPrimary,
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    footerInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    versionBox: {
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    versionText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    copyright: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
});
