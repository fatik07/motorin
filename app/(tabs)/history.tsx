import { useRef, useState } from "react";
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

type ServiceRecord = {
    id: string;
    date: string;
    title: string;
    odometer: string;
    description: string;
    cost: string;
    status: "SELESAI" | "LAMA";
    category: "Oli" | "Ban" | "Mesin" | "Lainnya";
};

const SERVICE_RECORDS: ServiceRecord[] = [
    {
        id: "1",
        date: "12 Okt 2023",
        title: "Oli Mesin",
        odometer: "10.000 km",
        description: "Castrol Power1 10W-40",
        cost: "Rp 150.000",
        status: "SELESAI",
        category: "Oli",
    },
    {
        id: "2",
        date: "05 Sep 2023",
        title: "Ban Belakang",
        odometer: "9.200 km",
        description: "Michelin Pilot Street",
        cost: "Rp 450.000",
        status: "SELESAI",
        category: "Ban",
    },
    {
        id: "3",
        date: "10 Jul 2023",
        title: "Servis Rutin",
        odometer: "7.500 km",
        description: "Tune-up & Bersihkan CVT",
        cost: "Rp 200.000",
        status: "LAMA",
        category: "Mesin",
    },
];

const FILTER_TABS = ["Semua", "Oli", "Ban", "Mesin", "Cvt", "Lainnya"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

function ServiceCard({ record }: { record: ServiceRecord }) {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const animateButton = (toValue: number) => {
        Animated.spring(scaleAnim, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const isOld = record.status === "LAMA";

    return (
        <View style={styles.cardWrapper}>
            {/* Timeline dot */}
            <View
                style={[
                    styles.timelineDot,
                    isOld ? styles.timelineDotOld : styles.timelineDotActive,
                ]}
            />

            <Animated.View
                style={{ transform: [{ scale: scaleAnim }], flex: 1 }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={() => animateButton(0.97)}
                    onPressOut={() => animateButton(1)}
                    onPress={() => router.push(`/history/${record.id}`)}
                >
                    <NeoBrutalCard
                        style={[styles.card, isOld && styles.cardOld]}
                    >
                        {/* Card Header */}
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <Text style={styles.cardDate}>
                                    {record.date}
                                </Text>
                                <Text style={styles.cardTitle}>
                                    {record.title.toUpperCase()}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.statusBadge,
                                    isOld
                                        ? styles.statusBadgeOld
                                        : styles.statusBadgeDone,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        isOld
                                            ? styles.statusTextOld
                                            : styles.statusTextDone,
                                    ]}
                                >
                                    {record.status}
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
                                    {record.odometer}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <FileText
                                    size={18}
                                    color={COLORS.primary}
                                    strokeWidth={2.5}
                                />
                                <Text
                                    style={[styles.infoText, styles.infoItalic]}
                                >
                                    {record.description}
                                </Text>
                            </View>
                        </View>

                        {/* Card Footer */}
                        <View style={styles.cardFooter}>
                            <Text style={styles.costText}>{record.cost}</Text>
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
    const [activeFilter, setActiveFilter] = useState<FilterTab>("Semua");
    const fabScale = useRef(new Animated.Value(1)).current;

    const animateFab = (toValue: number) => {
        Animated.spring(fabScale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const filteredRecords =
        activeFilter === "Semua"
            ? SERVICE_RECORDS
            : SERVICE_RECORDS.filter((r) => r.category === activeFilter);

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
                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {FILTER_TABS.map((tab) => {
                        const isActive = activeFilter === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                activeOpacity={0.8}
                                style={[
                                    styles.filterChip,
                                    isActive && styles.filterChipActive,
                                ]}
                                onPress={() => setActiveFilter(tab)}
                            >
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        isActive && styles.filterChipTextActive,
                                    ]}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Timeline List */}
                <View style={styles.timeline}>
                    {filteredRecords.length > 0 ? (
                        <>
                            <View style={styles.timelineLine} />

                            {filteredRecords.map((record) => (
                                <ServiceCard key={record.id} record={record} />
                            ))}
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                Tidak ada riwayat servis.
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
                    onPress={() => router.push("/history/add")}
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
    },
    timelineDotActive: {
        backgroundColor: COLORS.primary,
    },
    timelineDotOld: {
        backgroundColor: COLORS.border,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: 16,
    },
    cardOld: {
        opacity: 0.75,
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
    statusBadge: {
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    statusBadgeDone: {
        backgroundColor: "#6dfe9c",
    },
    statusBadgeOld: {
        backgroundColor: "#d0c6ab",
    },
    statusText: {
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    statusTextDone: {
        color: "#007439",
    },
    statusTextOld: {
        color: COLORS.textSecondary,
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
