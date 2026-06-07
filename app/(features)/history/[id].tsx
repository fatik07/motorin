import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Calendar, Gauge, FileText, Wallet, Wrench } from "lucide-react-native";

import { COLORS, BORDER_WIDTH } from "@constants/theme";
import { NeoBrutalCard, TabsHeader } from "@components/index";

const SERVICE_RECORDS = [
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

export default function ServiceDetailScreen() {
    const { id } = useLocalSearchParams();

    const record = SERVICE_RECORDS.find((item) => item.id === id);

    if (!record) {
        return (
            <View style={styles.center}>
                <Text style={styles.notFound}>Data servis tidak ditemukan</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TabsHeader title="Detail Servis" />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <NeoBrutalCard style={styles.heroCard}>
                    <Text style={styles.title}>
                        {record.title.toUpperCase()}
                    </Text>

                    <View
                        style={[
                            styles.statusBadge,
                            record.status === "SELESAI"
                                ? styles.doneBadge
                                : styles.oldBadge,
                        ]}
                    >
                        <Text style={styles.statusText}>{record.status}</Text>
                    </View>
                </NeoBrutalCard>

                {/* Informasi */}
                <NeoBrutalCard>
                    <Text style={styles.sectionTitle}>INFORMASI SERVIS</Text>

                    <View style={styles.row}>
                        <Calendar size={18} color={COLORS.primary} />
                        <Text style={styles.value}>{record.date}</Text>
                    </View>

                    <View style={styles.row}>
                        <Gauge size={18} color={COLORS.primary} />
                        <Text style={styles.value}>{record.odometer}</Text>
                    </View>

                    <View style={styles.row}>
                        <Wrench size={18} color={COLORS.primary} />
                        <Text style={styles.value}>{record.category}</Text>
                    </View>

                    <View style={styles.row}>
                        <FileText size={18} color={COLORS.primary} />
                        <Text style={styles.value}>{record.description}</Text>
                    </View>

                    <View style={styles.row}>
                        <Wallet size={18} color={COLORS.primary} />
                        <Text style={styles.cost}>{record.cost}</Text>
                    </View>
                </NeoBrutalCard>

                {/* Catatan */}
                <NeoBrutalCard>
                    <Text style={styles.sectionTitle}>CATATAN</Text>

                    <Text style={styles.note}>
                        Servis dilakukan sesuai jadwal perawatan kendaraan.
                        Semua komponen telah diperiksa dan dalam kondisi baik.
                    </Text>
                </NeoBrutalCard>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    content: {
        padding: 20,
        gap: 16,
        paddingBottom: 40,
    },

    heroCard: {
        gap: 12,
    },

    title: {
        fontSize: 24,
        fontWeight: "900",
        color: COLORS.textPrimary,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "900",
        marginBottom: 16,
        letterSpacing: 1,
        color: COLORS.textSecondary,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },

    value: {
        fontSize: 15,
        color: COLORS.textPrimary,
        fontWeight: "600",
    },

    cost: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: "900",
    },

    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
    },

    doneBadge: {
        backgroundColor: "#6dfe9c",
    },

    oldBadge: {
        backgroundColor: "#d0c6ab",
    },

    statusText: {
        fontWeight: "800",
        fontSize: 12,
    },

    note: {
        fontSize: 15,
        lineHeight: 24,
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
    },
});
