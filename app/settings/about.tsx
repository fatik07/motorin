import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { useRef } from "react";
import { useRouter } from "expo-router";
import { ArrowLeft, Bolt, BarChart3, BellRing, History, Mail, ShieldCheck, Star } from "lucide-react-native";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import { NeoBrutalCard } from "@components/index";
import LogoImage from "@components/LogoImage";

export default function AboutScreen() {
    const router = useRouter();
    const backButtonScale = useRef(new Animated.Value(1)).current;

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        onPressIn={() => animateButton(backButtonScale, 0.9)}
                        onPressOut={() => animateButton(backButtonScale, 1)}
                        activeOpacity={1}
                    >
                        <ArrowLeft size={20} color={COLORS.textPrimary} strokeWidth={2.5} />
                    </TouchableOpacity>
                </Animated.View>
                <Text style={styles.headerTitle}>TENTANG MOTORIN</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoWrapper}>
                        <LogoImage size="medium" />
                    </View>
                </View>

                {/* Description */}
                <NeoBrutalCard style={styles.descriptionCard}>
                    <View style={styles.cardHeader}>
                        <Bolt size={24} color={COLORS.primary} fill={COLORS.primary} />
                        <Text style={styles.cardTitle}>THE ULTIMATE RIDER COMPANION</Text>
                    </View>
                    <Text style={styles.descriptionText}>
                        Motorin dirancang khusus untuk para riders Indonesia yang menganggap motor bukan sekadar alat transportasi, melainkan identitas. Kami hadir untuk membantu Anda memantau kesehatan motor, mencatat servis, dan memastikan kendaraan selalu dalam kondisi prima untuk menaklukkan aspal jalanan setiap hari.
                    </Text>
                </NeoBrutalCard>

                {/* Features Grid */}
                <View style={styles.featuresContainer}>
                    <View style={[styles.featureCard, { backgroundColor: COLORS.primary }]}>
                        <View style={styles.featureIconBox}>
                            <BarChart3 size={24} color={COLORS.textPrimary} />
                        </View>
                        <Text style={styles.featureTitle}>TRACKING PINTAR</Text>
                        <Text style={styles.featureDesc}>Pantau penggunaan oli, ban, dan mesin secara real-time.</Text>
                    </View>

                    <View style={[styles.featureCard, { backgroundColor: COLORS.secondary }]}>
                        <View style={styles.featureIconBox}>
                            <BellRing size={24} color={COLORS.textPrimary} />
                        </View>
                        <Text style={styles.featureTitle}>PENGINGAT OTOMATIS</Text>
                        <Text style={styles.featureDesc}>Jangan lewatkan jadwal ganti oli dan servis rutin motor Anda.</Text>
                    </View>

                    <View style={[styles.featureCard, { backgroundColor: '#ffd545' }]}>
                        <View style={styles.featureIconBox}>
                            <History size={24} color={COLORS.textPrimary} />
                        </View>
                        <Text style={styles.featureTitle}>RIWAYAT DIGITAL</Text>
                        <Text style={styles.featureDesc}>Simpan semua bukti servis dan penggantian part dalam satu genggaman.</Text>
                    </View>
                </View>

                {/* App Info */}
                <View style={styles.infoSection}>
                    <View style={styles.versionBox}>
                        <Text style={styles.infoLabel}>VERSI APLIKASI</Text>
                        <Text style={styles.versionNumber}>1.0.4-stable</Text>
                    </View>
                    <View style={styles.quoteBox}>
                        <Text style={styles.quoteText}>
                            "Dibuat dengan semangat untuk para Riders Indonesia."
                        </Text>
                    </View>
                </View>

                {/* Social Links */}
                <View style={styles.linksContainer}>
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>HUBUNGI KAMI</Text>
                        <Mail size={20} color={COLORS.textPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>KEBIJAKAN PRIVASI</Text>
                        <ShieldCheck size={20} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        marginTop: 40,
        height: 52,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
    },
    backButton: {
        width: 30,
        height: 30,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
    },
    logoSection: {
        alignItems: "center",
        marginBottom: 10,
        marginTop: -30,
    },
    logoWrapper: {
        transform: [{ rotate: "-3deg" }],
    },
    descriptionCard: {
        backgroundColor: COLORS.surface,
        padding: 24,
        marginBottom: 24,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.textPrimary,
        flex: 1,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.textSecondary,
        fontWeight: "500",
    },
    featuresContainer: {
        gap: 16,
        marginBottom: 24,
    },
    featureCard: {
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 20,
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    featureIconBox: {
        width: 44,
        height: 44,
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    featureDesc: {
        fontSize: 13,
        fontWeight: "500",
        color: COLORS.textPrimary,
        opacity: 0.8,
    },
    infoSection: {
        gap: 12,
        marginBottom: 24,
    },
    versionBox: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 16,
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: "800",
        color: COLORS.textSecondary,
        letterSpacing: 1,
        marginBottom: 4,
    },
    versionNumber: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    quoteBox: {
        backgroundColor: "#313030",
        padding: 16,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    quoteText: {
        color: COLORS.primary,
        fontStyle: "italic",
        fontWeight: "600",
        fontSize: 14,
    },
    linksContainer: {
        gap: 12,
    },
    linkButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingHorizontal: 20,
        height: 56,
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    linkText: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
});
