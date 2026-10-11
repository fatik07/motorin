import { useMemo, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Plus, Bike } from "lucide-react-native";
import { COLORS, BORDER_WIDTH } from "@constants/theme";
import { TabsHeader } from "@components/index";
import { useMotorStore } from "@store/useMotorStore";
import { useComponentStore } from "@store/useComponentStore";
import { useSettingsStore } from "@store/useSettingsStore";
import { withComponentStatus } from "@utils/componentStatus";
import type { Motor } from "../../src/types";

const formatKm = (km: number) => `${km.toLocaleString("id-ID")} km`;

function useMotorHealth(motor: Motor) {
    const components = useComponentStore((state) => state.components);
    const notificationThresholdKm = useSettingsStore(
        (state) => state.notificationThresholdKm,
    );

    return useMemo(() => {
        const motorComponents = components.filter(
            (c) => c.motorId === motor.id && !c.isHidden,
        );
        if (motorComponents.length === 0) return null;

        const withStatus = motorComponents
            .map((c) => withComponentStatus(c, motor.currentKm, notificationThresholdKm))
            .sort((a, b) => a.remainingKm - b.remainingKm);

        return withStatus[0];
    }, [components, motor.id, motor.currentKm, notificationThresholdKm]);
}

function MotorCard({
    motor,
    isActive,
    scale,
    onPress,
    onPressIn,
    onPressOut,
}: {
    motor: Motor;
    isActive: boolean;
    scale: Animated.Value;
    onPress: () => void;
    onPressIn: () => void;
    onPressOut: () => void;
}) {
    const mostUrgent = useMotorHealth(motor);

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={onPress}
            >
                <View style={styles.card}>
                    {/* IMAGE */}
                    <View style={styles.imageBox}>
                        {motor.photoUri ? (
                            <Image
                                source={{ uri: motor.photoUri }}
                                style={styles.image}
                            />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Bike size={48} color={COLORS.textSecondary} />
                            </View>
                        )}

                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {motor.fuelType === "listrik" ? "LISTRIK" : "BENSIN"}
                            </Text>
                        </View>

                        {isActive && (
                            <View style={styles.activeBadge}>
                                <Text style={styles.activeBadgeText}>AKTIF</Text>
                            </View>
                        )}
                    </View>

                    {/* CONTENT */}
                    <View style={styles.body}>
                        <View style={styles.headerRow}>
                            <Text style={styles.name}>{motor.name}</Text>
                        </View>

                        {/* INFO */}
                        <View style={styles.grid}>
                            <View style={styles.box}>
                                <Text style={styles.label}>Odometer</Text>
                                <Text style={styles.value}>
                                    {formatKm(motor.currentKm)}
                                </Text>
                            </View>

                            <View style={[styles.box, styles.boxAccent]}>
                                <Text
                                    style={[styles.label, { color: COLORS.primary }]}
                                >
                                    Transmisi
                                </Text>
                                <Text
                                    style={[styles.value, { color: COLORS.primary }]}
                                >
                                    {motor.fuelType === "listrik"
                                        ? "Listrik"
                                        : motor.transmission === "manual"
                                          ? "Manual"
                                          : "Matic"}
                                </Text>
                            </View>
                        </View>

                        {/* PROGRESS: komponen paling mendesak */}
                        {mostUrgent && (
                            <View style={{ marginTop: 12 }}>
                                <View style={styles.progressHeader}>
                                    <Text style={styles.label} numberOfLines={1}>
                                        {mostUrgent.name}
                                    </Text>
                                    <Text style={styles.label}>
                                        {Math.round(mostUrgent.progressPercentage)}%
                                    </Text>
                                </View>

                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${Math.min(100, mostUrgent.progressPercentage)}%`,
                                            },
                                        ]}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function GarageScreen() {
    const router = useRouter();
    const motors = useMotorStore((state) => state.motors);
    const activeMotorId = useMotorStore((state) => state.activeMotorId);

    const scales = useRef(new Map<string, Animated.Value>()).current;
    const fabScale = useRef(new Animated.Value(1)).current;

    const getScale = (id: string) => {
        if (!scales.has(id)) scales.set(id, new Animated.Value(1));
        return scales.get(id)!;
    };

    const animate = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.stickyHeader}>
                <TabsHeader title="Garage" />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* TITLE */}
                <View style={{ marginBottom: 16 }}>
                    <Text style={styles.title}>Garasi Saya</Text>
                    <Text style={styles.subtitle}>
                        Kamu punya {motors.length} motor terdaftar.
                    </Text>
                </View>

                {/* MOTOR LIST */}
                {motors.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Bike size={40} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>
                            Belum ada motor. Tambahkan motor pertamamu lewat
                            tombol + di bawah.
                        </Text>
                    </View>
                ) : (
                    <View style={{ gap: 16 }}>
                        {motors.map((motor) => (
                            <MotorCard
                                key={motor.id}
                                motor={motor}
                                isActive={motor.id === activeMotorId}
                                scale={getScale(motor.id)}
                                onPressIn={() => animate(getScale(motor.id), 0.97)}
                                onPressOut={() => animate(getScale(motor.id), 1)}
                                onPress={() => router.push(`/garage/${motor.id}`)}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* FAB */}
            <Animated.View
                style={[styles.fabWrap, { transform: [{ scale: fabScale }] }]}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.fab}
                    onPressIn={() => animate(fabScale, 0.9)}
                    onPressOut={() => animate(fabScale, 1)}
                    onPress={() => router.push("/onboarding/add-motor-name")}
                >
                    <Plus size={28} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

/* STYLE */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    stickyHeader: {
        backgroundColor: COLORS.background,
        borderBottomWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        elevation: 4,
        zIndex: 10,
    },

    content: {
        padding: 20,
        paddingBottom: 120,
    },

    title: {
        fontSize: 24,
        fontWeight: "900",
        color: COLORS.textPrimary,
    },

    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },

    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingVertical: 60,
    },

    emptyText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: "center",
        maxWidth: 260,
    },

    /* CARD */
    card: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
    },

    imageBox: {
        height: 180,
        position: "relative",
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

    activeBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: COLORS.green,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
    },

    activeBadgeText: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },

    body: {
        padding: 16,
    },

    headerRow: {
        marginBottom: 12,
    },

    name: {
        fontSize: 20,
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
        padding: 10,
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
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textPrimary,
        marginTop: 4,
    },

    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
        gap: 8,
    },

    progressBar: {
        height: 10,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        backgroundColor: "#eee",
    },

    progressFill: {
        height: "100%",
        backgroundColor: COLORS.primary,
    },

    /* FAB */
    fabWrap: {
        position: "absolute",
        bottom: 100,
        right: 20,
    },

    fab: {
        width: 56,
        height: 56,
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        justifyContent: "center",
        alignItems: "center",
    },
});
