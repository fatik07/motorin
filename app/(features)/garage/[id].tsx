import { useMemo, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Bike, Gauge, CheckCircle2 } from "lucide-react-native";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import { useMotorStore } from "@store/useMotorStore";
import { useComponentStore } from "@store/useComponentStore";
import { useSettingsStore } from "@store/useSettingsStore";
import { withComponentStatus } from "@utils/componentStatus";

const formatKm = (km: number) => `${km.toLocaleString("id-ID")} km`;

export default function GarageMotorDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const backButtonScale = useRef(new Animated.Value(1)).current;

    const motor = useMotorStore((state) =>
        state.motors.find((m) => m.id === id),
    );
    const activeMotorId = useMotorStore((state) => state.activeMotorId);
    const setActiveMotor = useMotorStore((state) => state.setActiveMotor);
    const components = useComponentStore((state) => state.components);
    const notificationThresholdKm = useSettingsStore(
        (state) => state.notificationThresholdKm,
    );

    const isActive = motor?.id === activeMotorId;

    const motorComponents = useMemo(() => {
        if (!motor) return [];
        return components
            .filter((c) => c.motorId === motor.id && !c.isHidden)
            .map((c) => withComponentStatus(c, motor.currentKm, notificationThresholdKm))
            .sort((a, b) => a.remainingKm - b.remainingKm);
    }, [components, motor, notificationThresholdKm]);

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    if (!motor) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.center}>
                    <Text style={styles.notFound}>Motor tidak ditemukan</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={20} color={COLORS.textPrimary} strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Animated.View
                    style={{ transform: [{ scale: backButtonScale }] }}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        onPressIn={() => animateButton(backButtonScale, 0.9)}
                        onPressOut={() => animateButton(backButtonScale, 1)}
                        activeOpacity={1}
                    >
                        <ArrowLeft
                            size={20}
                            color={COLORS.textPrimary}
                            strokeWidth={2.5}
                        />
                    </TouchableOpacity>
                </Animated.View>
                <Text style={styles.title} numberOfLines={1}>
                    {motor.name}
                </Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imageBox}>
                    {motor.photoUri ? (
                        <Image source={{ uri: motor.photoUri }} style={styles.image} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Bike size={56} color={COLORS.textSecondary} />
                        </View>
                    )}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {motor.fuelType === "listrik" ? "LISTRIK" : "BENSIN"}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.name}>{motor.name}</Text>

                    <View style={styles.grid}>
                        <View style={styles.box}>
                            <Gauge size={16} color={COLORS.textSecondary} />
                            <Text style={styles.label}>Odometer</Text>
                            <Text style={styles.value}>
                                {formatKm(motor.currentKm)}
                            </Text>
                        </View>

                        <View style={[styles.box, styles.boxAccent]}>
                            <Text style={[styles.label, { color: COLORS.primary }]}>
                                Transmisi
                            </Text>
                            <Text style={[styles.value, { color: COLORS.primary }]}>
                                {motor.fuelType === "listrik"
                                    ? "Listrik"
                                    : motor.transmission === "manual"
                                      ? "Manual"
                                      : "Matic"}
                            </Text>
                        </View>
                    </View>

                    {!isActive && (
                        <TouchableOpacity
                            style={styles.activateButton}
                            onPress={() => setActiveMotor(motor.id)}
                            activeOpacity={0.85}
                        >
                            <CheckCircle2
                                size={18}
                                color={COLORS.textPrimary}
                                strokeWidth={2.4}
                            />
                            <Text style={styles.activateButtonText}>
                                Jadikan Motor Aktif
                            </Text>
                        </TouchableOpacity>
                    )}
                    {isActive && (
                        <View style={styles.activeNotice}>
                            <Text style={styles.activeNoticeText}>
                                Motor ini sedang aktif di Dashboard
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.componentsCard}>
                    <Text style={styles.sectionTitle}>
                        KOMPONEN ({motorComponents.length})
                    </Text>
                    {motorComponents.length === 0 ? (
                        <Text style={styles.emptyText}>Belum ada komponen.</Text>
                    ) : (
                        motorComponents.map((c) => (
                            <View key={c.id} style={styles.componentRow}>
                                <Text style={styles.componentName}>{c.name}</Text>
                                <Text style={styles.componentKm}>
                                    {c.remainingKm <= 0
                                        ? `Lewat ${formatKm(Math.abs(c.remainingKm))}`
                                        : `Sisa ${formatKm(c.remainingKm)}`}
                                </Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    notFound: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textPrimary,
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
    title: {
        flex: 1,
        textAlign: "center",
        marginHorizontal: 8,
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
        gap: 16,
    },
    imageBox: {
        height: 200,
        position: "relative",
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
    },
    badge: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    infoCard: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 20,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        gap: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: "900",
        color: COLORS.textPrimary,
    },
    grid: {
        flexDirection: "row",
        gap: 10,
    },
    box: {
        flex: 1,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 12,
        gap: 4,
    },
    boxAccent: {
        backgroundColor: "#fff3c4",
    },
    label: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.textSecondary,
    },
    value: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    activateButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingVertical: 14,
    },
    activateButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textPrimary,
        textTransform: "uppercase",
    },
    activeNotice: {
        backgroundColor: "#ecfdf5",
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 12,
        alignItems: "center",
    },
    activeNoticeText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.success,
    },
    componentsCard: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 20,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: 1,
        color: COLORS.textSecondary,
    },
    emptyText: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    componentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: BORDER_WIDTH.thin,
        borderTopColor: COLORS.border,
        paddingTop: 10,
    },
    componentName: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    componentKm: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
});
