import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ArrowRight, Wrench, History, Droplet } from "lucide-react-native";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import LogoImage from "@components/LogoImage";

export default function OnboardingScreen() {
    const router = useRouter();
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Floating animation for badge
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -3,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <View style={styles.content}>
                {/* Illustration Section with Neobrutalist Frame */}
                <View style={styles.illustrationContainer}>
                    {/* Background layers */}
                    <View style={[styles.frameLayer, styles.frameGreen]} />
                    <View style={[styles.frameLayer, styles.frameYellow]} />

                    {/* Main frame with image */}
                    <View style={styles.mainFrame}>
                        <Image
                            source={{
                                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyaEyhHdU4m5tuhhpaVoPgzDIlv6UaDttW6v-4mY_TNsmpE-G2MR16PPNfH5rzOai9tXMODi9zfg9p-gLK1TfW9kZBJULXzPkZ-SvXtdJ5q8uxFGSn1E8OdGJIjuG8Z_E1dUciXMxBfTdh_lxAQ0uPPfphdjFmsmHI4i8rKG6i1XmvYMjQySQCjUsw-Go9TC9zykGGXo1qo0QCY9Jw4lc6EE8CVrBNu0dRK_1yxZFXRx6iQbEmKbmblUWFF24guQFO_OmNaOe08khs",
                            }}
                            style={styles.motorcycleImage}
                            resizeMode="cover"
                        />

                        {/* Verified Badge */}
                        <Animated.View
                            style={[
                                styles.badge,
                                { transform: [{ translateY: floatAnim }] },
                            ]}
                        >
                            <Wrench
                                size={20}
                                color={COLORS.textPrimary}
                                strokeWidth={2.5}
                            />
                            <Text style={styles.badgeText}>VERIFIED</Text>
                        </Animated.View>
                    </View>
                </View>

                {/* Typography Section */}
                <View style={styles.textSection}>
                    <View style={styles.headlineContainer}>
                        <Text style={styles.headlineNormal}>
                            SELAMAT DATANG DI
                        </Text>

                        <LogoImage
                            size="small"
                            containerStyle={{
                                marginBottom: -15,
                                marginTop: -15,
                            }}
                        />
                    </View>

                    <Text style={styles.subtitle}>
                        Pantau kesehatan motormu dengan{"\n"}gaya yang beda.
                    </Text>
                </View>

                {/* Value Proposition Chips */}
                <View style={styles.chipsContainer}>
                    <View style={styles.chip}>
                        <Droplet size={16} color={COLORS.textPrimary} />
                        <Text style={styles.chipText}>CEK OLI</Text>
                    </View>
                    <View style={styles.chip}>
                        <Wrench size={16} color={COLORS.textPrimary} />
                        <Text style={styles.chipText}>SERVICE</Text>
                    </View>
                    <View style={styles.chip}>
                        <History size={16} color={COLORS.textPrimary} />
                        <Text style={styles.chipText}>RIWAYAT</Text>
                    </View>
                </View>
            </View>

            {/* Footer Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => router.push("/onboarding/add-motor-name")}
                    style={styles.button}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>MULAI SEKARANG</Text>
                    <ArrowRight
                        size={20}
                        color={COLORS.textPrimary}
                        strokeWidth={2.5}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    illustrationContainer: {
        width: "100%",
        maxWidth: 384,
        aspectRatio: 1,
        marginBottom: 24,
        position: "relative",
    },
    frameLayer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    frameGreen: {
        backgroundColor: "#6dfe9c",
        transform: [{ rotate: "3deg" }],
    },
    frameYellow: {
        backgroundColor: COLORS.primary,
        transform: [{ rotate: "-2deg" }],
    },
    mainFrame: {
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
        overflow: "hidden",
    },
    motorcycleImage: {
        width: "100%",
        height: "100%",
    },
    badge: {
        position: "absolute",
        bottom: 16,
        right: 16,
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },
    textSection: {
        alignItems: "center",
        maxWidth: 448,
        marginBottom: 24,
    },
    headlineContainer: {
        alignItems: "center",
        marginBottom: 12,
    },
    headlineNormal: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.textPrimary,
        textAlign: "center",
        letterSpacing: -0.5,
    },
    headlineHighlight: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginTop: 4,
    },
    headlineHighlightText: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.textPrimary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "500",
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: 28,
        paddingHorizontal: 16,
    },
    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        marginTop: 16,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    chipText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        width: "100%",
        maxWidth: 384,
        alignSelf: "center",
    },
    button: {
        width: "100%",
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
        letterSpacing: 1.5,
    },
    footerText: {
        marginTop: 12,
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textSecondary,
        textAlign: "center",
        opacity: 0.7,
    },
});
