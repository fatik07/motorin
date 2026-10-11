import { useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Gauge, FileText, ArrowRight, Plus } from "lucide-react-native";
import { COLORS, BORDER_WIDTH } from "@constants/theme";
import { NeoBrutalCard, TabsHeader } from "@components/index";
import { useComponentStore } from "@store/useComponentStore";
import { useMotorStore } from "@store/useMotorStore";
import { formatDateId } from "@utils/date";
import type { ServiceLog } from "../../src/types";

type HistoryEntry = ServiceLog & { componentName: string; motorName: string };

const formatNumber = (num: number) =>
    Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function ServiceCard({
    entry,
    showMotorName,
}: {
    entry: HistoryEntry;
    showMotorName: boolean;
}) {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const animateButton = (toValue: number) => {
        Animated.spring(scaleAnim, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    return (
        <View style={styles.cardWrapper}>
            {/* Timeline dot */}
            <View style={styles.timelineDot} />

            <Animated.View
                style={{ transform: [{ scale: scaleAnim }], flex: 1 }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={() => animateButton(0.97)}
                    onPressOut={() => animateButton(1)}
                    onPress={() => router.push(`/history/${entry.id}`)}
                >
                    <NeoBrutalCard style={styles.card}>
                        {/* Card Header */}
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <Text style={styles.cardDate}>
                                    {formatDateId(entry.serviceDate)}
                                    {showMotorName ? ` • ${entry.motorName}` : ""}
                                </Text>
                                <Text style={styles.cardTitle}>
                                    {entry.componentName.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Card Body */}
                        <View style={styles.cardBody}>
                            <View style={styles.infoRow}>
                                <Gauge
                                    size={18}
                                    color={COLORS.primary}
                                    strokeWidth={2.5}
                                />
                                <Text style={styles.infoText}>
                                    {formatNumber(entry.serviceKm)} km
                                </Text>
                            </View>
                            {(entry.brandUsed || entry.notes) && (
                                <View style={styles.infoRow}>
                                    <FileText
                                        size={18}
                                        color={COLORS.primary}
                                        strokeWidth={2.5}
                                    />
                                    <Text
                                        style={[
                                            styles.infoText,
                                            styles.infoItalic,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {[entry.brandUsed, entry.notes]
                                            .filter(Boolean)
                                            .join(" • ")}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Card Footer */}
                        <View style={styles.cardFooter}>
                            <Text style={styles.costText}>
                                {entry.cost
                                    ? `Rp ${formatNumber(entry.cost)}`
                                    : ""}
                            </Text>
                            <View style={styles.detailButton}>
                                <Text style={styles.detailButtonText}>
                                    DETAIL
                                </Text>
                                <ArrowRight
                                    size={14}
                                    color="#ffffff"
                                    strokeWidth={2.5}
                                />
                            </View>
                        </View>
                    </NeoBrutalCard>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

export default function HistoryScreen() {
    const router = useRouter();
    const serviceLogs = useComponentStore((state) => state.serviceLogs);
    const components = useComponentStore((state) => state.components);
    const motors = useMotorStore((state) => state.motors);
    const [motorFilterId, setMotorFilterId] = useState("all");
    const [componentFilterId, setComponentFilterId] = useState("all");
    const fabScale = useRef(new Animated.Value(1)).current;

    const animateFab = (toValue: number) => {
        Animated.spring(fabScale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const entries: HistoryEntry[] = useMemo(
        () =>
            serviceLogs
                .map((log) => ({
                    ...log,
                    componentName:
                        components.find((c) => c.id === log.componentId)
                            ?.name ?? "Komponen Dihapus",
                    motorName:
                        motors.find((m) => m.id === log.motorId)?.name ??
                        "Motor Dihapus",
                }))
                .sort((a, b) => (a.serviceDate < b.serviceDate ? 1 : -1)),
        [serviceLogs, components, motors],
    );

    const motorFilterOptions = useMemo(() => {
        const seen = new Map<string, string>();
        entries.forEach((entry) => {
            if (!seen.has(entry.motorId)) {
                seen.set(entry.motorId, entry.motorName);
            }
        });
        return [
            { id: "all", label: "Semua Motor" },
            ...Array.from(seen, ([id, label]) => ({ id, label })),
        ];
    }, [entries]);

    const motorFilteredEntries =
        motorFilterId === "all"
            ? entries
            : entries.filter((entry) => entry.motorId === motorFilterId);

    const componentFilterOptions = useMemo(() => {
        const seen = new Map<string, string>();
        motorFilteredEntries.forEach((entry) => {
            if (!seen.has(entry.componentId)) {
                seen.set(entry.componentId, entry.componentName);
            }
        });
        return [
            { id: "all", label: "Semua Komponen" },
            ...Array.from(seen, ([id, label]) => ({ id, label })),
        ];
    }, [motorFilteredEntries]);

    const filteredEntries =
        componentFilterId === "all"
            ? motorFilteredEntries
            : motorFilteredEntries.filter(
                  (entry) => entry.componentId === componentFilterId,
              );

    const handleMotorFilterChange = (id: string) => {
        setMotorFilterId(id);
        setComponentFilterId("all");
    };

    return (
        <View style={styles.container}>
            {/* Sticky Header */}
            <View style={styles.stickyHeader}>
                <TabsHeader title="Riwayat Servis" />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Motor Filter Chips (only relevant when there's more than one motor) */}
                {motors.length > 1 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterContainer}
                    >
                        {motorFilterOptions.map((option) => {
                            const isActive = motorFilterId === option.id;
                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.filterChip,
                                        isActive && styles.filterChipActive,
                                    ]}
                                    onPress={() => handleMotorFilterChange(option.id)}
                                >
                                    <Text
                                        style={[
                                            styles.filterChipText,
                                            isActive && styles.filterChipTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}

                {/* Component Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.filterContainer,
                        motors.length > 1 && { paddingTop: 0 },
                    ]}
                >
                    {componentFilterOptions.map((option) => {
                        const isActive = componentFilterId === option.id;
                        return (
                            <TouchableOpacity
                                key={option.id}
                                activeOpacity={0.8}
                                style={[
                                    styles.filterChip,
                                    isActive && styles.filterChipActive,
                                ]}
                                onPress={() => setComponentFilterId(option.id)}
                            >
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        isActive && styles.filterChipTextActive,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Timeline List */}
                <View style={styles.timeline}>
                    {filteredEntries.length > 0 ? (
                        <>
                            <View style={styles.timelineLine} />

                            {filteredEntries.map((entry) => (
                                <ServiceCard
                                    key={entry.id}
                                    entry={entry}
                                    showMotorName={motors.length > 1}
                                />
                            ))}
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                Belum ada riwayat servis.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* FAB */}
            <Animated.View
                style={[
                    styles.fabWrapper,
                    { transform: [{ scale: fabScale }] },
                ]}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.fab}
                    onPressIn={() => animateFab(0.92)}
                    onPressOut={() => animateFab(1)}
                    onPress={() => router.push("/history/tambah")}
                >
                    <Plus
                        size={28}
                        color={COLORS.textPrimary}
                        strokeWidth={2.5}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    stickyHeader: {
        backgroundColor: COLORS.background,
        borderBottomWidth: BORDER_WIDTH.thin,
        borderBottomColor: COLORS.border,
        shadowColor: COLORS.border,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        zIndex: 10,
        marginTop: 6,
    },
    scrollContent: {
        paddingBottom: 50,
    },

    // Filter
    filterContainer: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 8,
        gap: 10,
        flexDirection: "row",
    },
    filterChip: {
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: COLORS.surface,
        shadowColor: COLORS.border,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },
    filterChipTextActive: {
        color: COLORS.textPrimary,
    },

    // Timeline
    timeline: {
        paddingHorizontal: 20,
        paddingTop: 24,
        position: "relative",
    },
    timelineLine: {
        position: "absolute",
        left: 28,
        top: 24,
        bottom: 0,
        width: 2,
        backgroundColor: COLORS.border,
        opacity: 0.15,
    },

    // Card
    cardWrapper: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
        gap: 14,
    },
    timelineDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        marginTop: 22,
        marginLeft: 1.5,
        flexShrink: 0,
        backgroundColor: COLORS.primary,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    cardHeaderLeft: {
        gap: 2,
    },
    cardDate: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textSecondary,
        letterSpacing: 0.5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.textPrimary,
        letterSpacing: 0.3,
    },
    divider: {
        height: BORDER_WIDTH.thin,
        backgroundColor: COLORS.border,
        marginBottom: 12,
    },
    cardBody: {
        gap: 8,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    infoText: {
        fontSize: 15,
        fontWeight: "500",
        color: COLORS.textPrimary,
    },
    infoItalic: {
        fontStyle: "italic",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    costText: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
    },
    detailButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: COLORS.border,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: COLORS.border,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    detailButtonText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#ffffff",
        letterSpacing: 0.5,
    },

    // Empty state
    emptyState: {
        paddingVertical: 48,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textSecondary,
        opacity: 0.6,
    },

    // FAB
    fabWrapper: {
        position: "absolute",
        bottom: 20,
        right: 24,
        zIndex: 50,
    },
    fab: {
        width: 56,
        height: 56,
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
});
