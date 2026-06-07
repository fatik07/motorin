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
import {
    ArrowLeft,
    Gauge,
    FileText,
    Wallet,
    Calendar,
} from "lucide-react-native";
import NeoBrutalCard from "@components/NeoBrutalCard";

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

export default function HistoryDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const backButtonScale = useRef(new Animated.Value(1)).current;

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const record = SERVICE_RECORDS.find((item) => item.id === id);

    if (!record) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.center}>
                    <Text style={styles.notFound}>Data tidak ditemukan</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isDone = record.status === "SELESAI";

    return (
        <SafeAreaView style={styles.safe}>
            {/* HEADER */}
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

                <Text style={styles.title}>Detail Servis</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* CONTENT */}
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* HERO */}
                <View style={styles.heroCard}>
                    <Text style={styles.heroLabel}>RIWAYAT SERVIS</Text>
                    <Text style={styles.heroName}>
                        {record.title.toUpperCase()}
                    </Text>

                    <View
                        style={[
                            styles.heroBadge,
                            {
                                backgroundColor: isDone ? "#6dfe9c" : "#d0c6ab",
                            },
                        ]}
                    >
                        <Text style={styles.heroBadgeText}>
                            {record.status}
                        </Text>
                    </View>

                    <Text style={styles.heroDescription}>
                        {record.description}
                    </Text>
                </View>

                {/* INFO */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoCard}>
                        <Calendar size={18} color={COLORS.primary} />
                        <Text style={styles.infoLabel}>Tanggal</Text>
                        <Text style={styles.infoValue}>{record.date}</Text>
                    </View>

                    <View style={styles.infoCard}>
                        <Gauge size={18} color={COLORS.primary} />
                        <Text style={styles.infoLabel}>Odometer</Text>
                        <Text style={styles.infoValue}>{record.odometer}</Text>
                    </View>

                    <View style={styles.infoCard}>
                        <FileText size={18} color={COLORS.primary} />
                        <Text style={styles.infoLabel}>Kategori</Text>
                        <Text style={styles.infoValue}>{record.category}</Text>
                    </View>

                    <View style={[styles.infoCard, styles.costCard]}>
                        <Wallet size={18} color={COLORS.textPrimary} />
                        <Text style={styles.infoLabel}>Biaya</Text>
                        <Text style={styles.costValue}>{record.cost}</Text>
                    </View>
                </View>

                <NeoBrutalCard>
                    <Text style={styles.sectionTitle}>CATATAN</Text>

                    <Text style={styles.note}>
                        Servis dilakukan sesuai jadwal perawatan kendaraan.
                        Semua komponen telah diperiksa dan dalam kondisi baik.
                    </Text>
                </NeoBrutalCard>
            </ScrollView>
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

    backButton: {
        width: 30,
        height: 30,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },

    container: {
        flex: 1,
    },

    contentContainer: {
        padding: 20,
        gap: 16,
        paddingBottom: 40,
    },

    heroCard: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 20,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        elevation: 4,
        gap: 10,
    },

    heroLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textSecondary,
        textTransform: "uppercase",
    },

    heroName: {
        fontSize: 22,
        fontWeight: "900",
        color: COLORS.textPrimary,
    },

    heroBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
    },

    heroBadgeText: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },

    heroDescription: {
        fontSize: 14,
        color: COLORS.textPrimary,
    },

    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },

    infoCard: {
        width: "48%",
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 14,
        gap: 6,
    },

    infoLabel: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.textSecondary,
        textTransform: "uppercase",
    },

    infoValue: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },

    costCard: {
        backgroundColor: COLORS.primary,
    },

    costValue: {
        fontSize: 16,
        fontWeight: "900",
        color: COLORS.textPrimary,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    notFound: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "900",
        marginBottom: 16,
        letterSpacing: 1,
        color: COLORS.textSecondary,
    },

    note: {
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.textPrimary,
    },
});
