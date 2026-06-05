import { useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import { getStatusColor, getProgressColor } from "@utils/componentStatus";
import {
    Pencil,
    Droplet,
    Circle,
    Disc3,
    Battery,
    CircleAlert,
} from "lucide-react-native";
import type { ComponentWithStatus } from "../../src/types";

const categoryIcons: Record<string, React.ReactNode> = {
    engine: <Droplet size={32} color={COLORS.textPrimary} strokeWidth={2} />,
    tire: <Circle size={32} color={COLORS.textPrimary} strokeWidth={2} />,
    brake: <Disc3 size={32} color={COLORS.textPrimary} strokeWidth={2} />,
    battery: <Battery size={32} color={COLORS.textPrimary} strokeWidth={2} />,
    other: <CircleAlert size={32} color={COLORS.textPrimary} strokeWidth={2} />,
};

const statusLabels: Record<string, string> = {
    good: "AMAN",
    warning: "WASPADA",
    critical: "BAHAYA",
};

const statusDescriptions: Record<string, string> = {
    good: "Kondisi komponen masih dalam keadaan baik.",
    warning: "Segera lakukan pengecekan untuk menjaga performa.",
    critical:
        "Segera lakukan penggantian untuk menjaga performa mesin tetap optimal.",
};

export default function ComponentDetailScreen() {
    const router = useRouter();
    const { data } = useLocalSearchParams<{ data: string }>();
    const editButtonScale = useRef(new Animated.Value(1)).current;

    const component: ComponentWithStatus = data
        ? JSON.parse(data)
        : {
              id: "",
              motorId: "",
              name: "Unknown",
              category: "other",
              status: "good",
              remainingKm: 0,
              progressPercentage: 0,
          };

    const statusColor = getStatusColor(component.status);
    const progressColor = getProgressColor(component.status);
    const targetKm = (component.installKm ?? 0) + (component.lifespan ?? 0);

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const formatNumber = (num: number) =>
        num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.closeBtn}
                >
                    <Text style={styles.closeX}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Detail {component.name}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Status Card */}
                <View style={styles.heroCard}>
                    <View style={styles.heroDecor1} />
                    <View style={styles.heroDecor2} />

                    <View style={styles.heroTopRow}>
                        <View style={styles.heroTextBlock}>
                            <Text style={styles.heroLabel}>Komponen Utama</Text>
                            <Text style={styles.heroName}>
                                {component.name.toUpperCase()}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.heroBadge,
                                { backgroundColor: statusColor },
                            ]}
                        >
                            <Text style={styles.heroBadgeText}>
                                {statusLabels[component.status]}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.heroBottomRow}>
                        <View style={styles.heroIconBox}>
                            {categoryIcons[component.category] ??
                                categoryIcons.other}
                        </View>
                        <Text style={styles.heroDescription}>
                            {statusDescriptions[component.status]}
                        </Text>
                    </View>
                </View>

                {/* Progress Section */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>
                            STATUS PENGGUNAAN
                        </Text>
                        <Text
                            style={[
                                styles.progressPercent,
                                { color: progressColor },
                            ]}
                        >
                            {component.progressPercentage}%
                        </Text>
                    </View>

                    <View style={styles.progressBarBackground}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${Math.min(100, component.progressPercentage)}%`,
                                    backgroundColor: progressColor,
                                },
                            ]}
                        />
                        {/* Warning marker at 75% */}
                        <View
                            style={[styles.progressMarker, { left: "75%" }]}
                        />
                    </View>

                    <View style={styles.progressLabels}>
                        <Text style={styles.progressLabelText}>0 km</Text>
                        <Text style={styles.progressLabelText}>
                            Batas: {formatNumber(component.lifespan ?? 0)} km
                        </Text>
                    </View>
                </View>

                {/* Info Grid 2x2 */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>
                            Terakhir Diganti
                        </Text>
                        <Text style={styles.infoCardValue}>
                            {formatNumber(component.installKm ?? 0)}{" "}
                            <Text style={styles.infoCardUnit}>km</Text>
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>Ganti Setiap</Text>
                        <Text style={styles.infoCardValue}>
                            {formatNumber(component.lifespan ?? 0)}{" "}
                            <Text style={styles.infoCardUnit}>km</Text>
                        </Text>
                    </View>

                    <View style={[styles.infoCard, styles.infoCardDashed]}>
                        <Text style={styles.infoCardLabel}>
                            Target Berikutnya
                        </Text>
                        <Text
                            style={[
                                styles.infoCardValue,
                                { color: COLORS.success },
                            ]}
                        >
                            {formatNumber(targetKm)}{" "}
                            <Text style={styles.infoCardUnit}>km</Text>
                        </Text>
                    </View>

                    <View style={[styles.infoCard, styles.infoCardDanger]}>
                        <Text
                            style={[
                                styles.infoCardLabel,
                                { color: COLORS.error },
                            ]}
                        >
                            Sisa Jarak
                        </Text>
                        <Text
                            style={[
                                styles.infoCardValue,
                                { color: COLORS.error },
                            ]}
                        >
                            {formatNumber(component.remainingKm)}{" "}
                            <Text style={styles.infoCardUnit}>km</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Edit Button */}
            <Animated.View
                style={{
                    transform: [{ scale: editButtonScale }],
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.editButton}
                    onPress={() =>
                        router.push({
                            pathname: `/component/edit/${component.id}`,
                            params: { data: JSON.stringify(component) },
                        })
                    }
                    onPressIn={() => animateButton(editButtonScale, 0.95)}
                    onPressOut={() => animateButton(editButtonScale, 1)}
                >
                    <View style={styles.editRow}>
                        <Pencil
                            size={18}
                            color={COLORS.textPrimary}
                            strokeWidth={2.4}
                        />
                        <Text style={styles.editButtonText}>Edit Komponen</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
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
    closeBtn: {
        width: 30,
        height: 30,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },
    closeX: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    title: {
        fontSize: 20,
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

    // Hero Card
    heroCard: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 20,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        position: "relative",
        overflow: "hidden",
        gap: 16,
    },
    heroDecor1: {
        position: "absolute",
        top: -16,
        right: -16,
        width: 80,
        height: 80,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        opacity: 0.1,
        transform: [{ rotate: "12deg" }],
    },
    heroDecor2: {
        position: "absolute",
        bottom: -8,
        left: -8,
        width: 50,
        height: 50,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        opacity: 0.08,
        transform: [{ rotate: "-15deg" }],
    },
    heroTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    heroTextBlock: {
        gap: 4,
    },
    heroLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textSecondary,
        letterSpacing: 1.5,
        textTransform: "uppercase",
    },
    heroName: {
        fontSize: 24,
        fontWeight: "900",
        color: COLORS.textPrimary,
        letterSpacing: -0.5,
    },
    heroBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        shadowColor: COLORS.border,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    heroBadgeText: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.textPrimary,
        letterSpacing: 1,
    },
    heroBottomRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    heroIconBox: {
        width: 56,
        height: 56,
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },
    heroDescription: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.textPrimary,
    },

    // Progress Section
    progressCard: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 20,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        gap: 12,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },
    progressPercent: {
        fontSize: 22,
        fontWeight: "700",
    },
    progressBarBackground: {
        height: 28,
        backgroundColor: "#E5E7EB",
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        position: "relative",
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
    },
    progressMarker: {
        position: "absolute",
        top: 0,
        height: "100%",
        width: 2,
        backgroundColor: COLORS.border,
        opacity: 0.3,
    },
    progressLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    progressLabelText: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textSecondary,
        textTransform: "uppercase",
    },

    // Info Grid
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    infoCard: {
        width: "48%",
        flexGrow: 1,
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 16,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        gap: 6,
    },
    infoCardDashed: {
        borderStyle: "dashed",
        borderColor: COLORS.success,
    },
    infoCardDanger: {
        backgroundColor: COLORS.pink,
    },
    infoCardLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    infoCardValue: {
        fontSize: 22,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    infoCardUnit: {
        fontSize: 14,
        fontWeight: "400",
    },

    // Edit Button
    editButton: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingVertical: 18,
        alignItems: "center",
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        marginHorizontal: 18,
        marginVertical: 20,
    },
    editRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.textPrimary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});
