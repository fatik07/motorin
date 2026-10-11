import { useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import { getStatusColor, getProgressColor, withComponentStatus } from "@utils/componentStatus";
import { formatDateId } from "@utils/date";
import { predictReplacementDate } from "@utils/prediction";
import { useComponentStore } from "@store/useComponentStore";
import { useMotorStore } from "@store/useMotorStore";
import { useSettingsStore } from "@store/useSettingsStore";
import { Pencil, Wrench, ArrowLeft, CheckCircle2, BellOff } from "lucide-react-native";

const statusLabels: Record<string, string> = {
    safe: "AMAN",
    warning: "WASPADA",
    overdue: "LEWAT BATAS",
};

const statusDescriptions: Record<string, string> = {
    safe: "Kondisi komponen masih dalam keadaan baik.",
    warning: "Segera lakukan pengecekan untuk menjaga performa.",
    overdue:
        "Sudah melewati batas servis. Segera lakukan penggantian untuk menjaga performa mesin tetap optimal.",
};

const formatNumber = (num: number) =>
    Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function ComponentDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const editButtonScale = useRef(new Animated.Value(1)).current;
    const serviceButtonScale = useRef(new Animated.Value(1)).current;
    const backButtonScale = useRef(new Animated.Value(1)).current;

    const rawComponent = useComponentStore((state) =>
        state.components.find((c) => c.id === id),
    );
    const currentKm = useMotorStore(
        (state) =>
            state.motors.find((m) => m.id === rawComponent?.motorId)?.currentKm ?? 0,
    );
    const motorKmLogs = useMotorStore((state) =>
        state.kmLogs.filter((log) => log.motorId === rawComponent?.motorId),
    );
    const serviceLogs = useComponentStore((state) =>
        state.serviceLogs
            .filter((log) => log.componentId === id)
            .sort((a, b) => (a.serviceDate < b.serviceDate ? 1 : -1)),
    );
    const markServiced = useComponentStore((state) => state.markServiced);
    const toggleMuteComponent = useComponentStore(
        (state) => state.toggleMuteComponent,
    );
    const notificationThresholdKm = useSettingsStore(
        (state) => state.notificationThresholdKm,
    );

    const [showServiceModal, setShowServiceModal] = useState(false);
    const [kmInput, setKmInput] = useState("");
    const [brandInput, setBrandInput] = useState("");
    const [costInput, setCostInput] = useState("");
    const [notesInput, setNotesInput] = useState("");

    const component = useMemo(
        () =>
            rawComponent
                ? withComponentStatus(rawComponent, currentKm, notificationThresholdKm)
                : null,
        [rawComponent, currentKm, notificationThresholdKm],
    );

    const prediction = useMemo(
        () =>
            component
                ? predictReplacementDate(motorKmLogs, component.remainingKm)
                : null,
        [component, motorKmLogs],
    );

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    if (!component) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.center}>
                    <Text style={styles.notFound}>Komponen tidak ditemukan</Text>
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

    const statusColor = getStatusColor(component.statusLevel);
    const progressColor = getProgressColor(component.statusLevel);
    const targetKm = component.lastServiceKm + component.intervalKm;

    const openServiceModal = () => {
        setKmInput(currentKm.toString());
        setBrandInput("");
        setCostInput("");
        setNotesInput("");
        setShowServiceModal(true);
    };

    const handleConfirmServiced = () => {
        const serviceKm = parseInt(kmInput.replace(/[^0-9]/g, ""), 10);
        if (!serviceKm || serviceKm <= 0) return;

        markServiced(component.id, {
            serviceKm,
            brandUsed: brandInput.trim() || undefined,
            cost: costInput ? parseInt(costInput.replace(/[^0-9]/g, ""), 10) : undefined,
            notes: notesInput.trim() || undefined,
        });
        setShowServiceModal(false);
    };

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
                    Detail {component.name}
                </Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[
                            styles.backButton,
                            component.isMuted && styles.headerButtonActive,
                        ]}
                        onPress={() => toggleMuteComponent(component.id)}
                        activeOpacity={0.8}
                    >
                        <BellOff
                            size={16}
                            color={COLORS.textPrimary}
                            strokeWidth={2.5}
                        />
                    </TouchableOpacity>
                    <Animated.View
                        style={{ transform: [{ scale: editButtonScale }] }}
                    >
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() =>
                                router.push(`/dashboard/edit/${component.id}`)
                            }
                            onPressIn={() => animateButton(editButtonScale, 0.9)}
                            onPressOut={() => animateButton(editButtonScale, 1)}
                            activeOpacity={1}
                        >
                            <Pencil
                                size={16}
                                color={COLORS.textPrimary}
                                strokeWidth={2.5}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
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
                                {statusLabels[component.statusLevel]}
                            </Text>
                        </View>
                    </View>

                    {component.isMuted && (
                        <View style={styles.mutedRow}>
                            <BellOff
                                size={14}
                                color={COLORS.textSecondary}
                                strokeWidth={2.5}
                            />
                            <Text style={styles.mutedText}>
                                Notifikasi komponen ini dimatikan
                            </Text>
                        </View>
                    )}

                    <View style={styles.heroBottomRow}>
                        <View style={styles.heroIconBox}>
                            <Wrench
                                size={32}
                                color={COLORS.textPrimary}
                                strokeWidth={2}
                            />
                        </View>
                        <Text style={styles.heroDescription}>
                            {statusDescriptions[component.statusLevel]}
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
                            {Math.round(component.progressPercentage)}%
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
                            Batas: {formatNumber(component.intervalKm)} km
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
                            {formatNumber(component.lastServiceKm)}{" "}
                            <Text style={styles.infoCardUnit}>km</Text>
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>Ganti Setiap</Text>
                        <Text style={styles.infoCardValue}>
                            {formatNumber(component.intervalKm)}{" "}
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
                            {component.remainingKm <= 0
                                ? "Sudah Lewat"
                                : "Sisa Jarak"}
                        </Text>
                        <Text
                            style={[
                                styles.infoCardValue,
                                { color: COLORS.error },
                            ]}
                        >
                            {formatNumber(Math.abs(component.remainingKm))}{" "}
                            <Text style={styles.infoCardUnit}>km</Text>
                        </Text>
                    </View>
                </View>

                {/* Prediction */}
                {component.remainingKm > 0 && (
                    <View style={styles.predictionCard}>
                        <Text style={styles.predictionLabel}>
                            PERKIRAAN TANGGAL GANTI
                        </Text>
                        {prediction ? (
                            <>
                                <Text style={styles.predictionValue}>
                                    {formatDateId(
                                        prediction.predictedDate.toISOString(),
                                    )}
                                </Text>
                                <Text style={styles.predictionHint}>
                                    Berdasarkan rata-rata pemakaian{" "}
                                    {formatNumber(prediction.avgKmPerDay)} km/hari.
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.predictionHint}>
                                Butuh lebih banyak riwayat update km untuk
                                memperkirakan tanggal.
                            </Text>
                        )}
                    </View>
                )}

                {/* Service History */}
                <View style={styles.historySection}>
                    <Text style={styles.historyTitle}>RIWAYAT SERVIS</Text>

                    {serviceLogs.length === 0 ? (
                        <View style={styles.historyEmpty}>
                            <Text style={styles.historyEmptyText}>
                                Belum ada riwayat servis untuk komponen ini.
                            </Text>
                        </View>
                    ) : (
                        serviceLogs.map((log) => (
                            <View key={log.id} style={styles.historyItem}>
                                <View style={styles.historyItemHeader}>
                                    <Text style={styles.historyDate}>
                                        {formatDateId(log.serviceDate)}
                                    </Text>
                                    <Text style={styles.historyKm}>
                                        {formatNumber(log.serviceKm)} KM
                                    </Text>
                                </View>
                                {(log.brandUsed || log.cost) && (
                                    <Text style={styles.historyMeta}>
                                        {[
                                            log.brandUsed,
                                            log.cost
                                                ? `Rp ${formatNumber(log.cost)}`
                                                : null,
                                        ]
                                            .filter(Boolean)
                                            .join(" • ")}
                                    </Text>
                                )}
                                {log.notes && (
                                    <Text style={styles.historyNotes}>
                                        {log.notes}
                                    </Text>
                                )}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Tandai Sudah Ganti/Servis */}
            <Animated.View
                style={{
                    transform: [{ scale: serviceButtonScale }],
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.serviceButton}
                    onPress={openServiceModal}
                    onPressIn={() => animateButton(serviceButtonScale, 0.95)}
                    onPressOut={() => animateButton(serviceButtonScale, 1)}
                >
                    <View style={styles.editRow}>
                        <CheckCircle2
                            size={18}
                            color={COLORS.textPrimary}
                            strokeWidth={2.4}
                        />
                        <Text style={styles.serviceButtonText}>
                            Tandai Sudah Ganti / Servis
                        </Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>

            {/* Service Modal */}
            <Modal
                visible={showServiceModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowServiceModal(false)}
            >
                <SafeAreaView style={modalStyles.safe}>
                    <KeyboardAvoidingView
                        style={modalStyles.container}
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >
                        <ScrollView
                            contentContainerStyle={modalStyles.sheet}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={modalStyles.handle} />

                            <Text style={modalStyles.title}>
                                TANDAI SUDAH SERVIS
                            </Text>
                            <Text style={modalStyles.subtitle}>
                                {component.name}
                            </Text>

                            <View style={modalStyles.inputBlock}>
                                <Text style={modalStyles.inputLabel}>
                                    KM SAAT PENGGANTIAN
                                </Text>
                                <TextInput
                                    keyboardType="number-pad"
                                    style={modalStyles.input}
                                    value={kmInput}
                                    onChangeText={(text) =>
                                        setKmInput(text.replace(/[^0-9]/g, ""))
                                    }
                                    placeholder="0"
                                    placeholderTextColor={COLORS.textSecondary}
                                />
                            </View>

                            <View style={modalStyles.inputBlock}>
                                <Text style={modalStyles.inputLabel}>
                                    MEREK / PRODUK (OPSIONAL)
                                </Text>
                                <TextInput
                                    style={modalStyles.input}
                                    value={brandInput}
                                    onChangeText={setBrandInput}
                                    placeholder="Contoh: Shell Advance"
                                    placeholderTextColor={COLORS.textSecondary}
                                />
                            </View>

                            <View style={modalStyles.inputBlock}>
                                <Text style={modalStyles.inputLabel}>
                                    BIAYA (OPSIONAL)
                                </Text>
                                <TextInput
                                    keyboardType="number-pad"
                                    style={modalStyles.input}
                                    value={costInput}
                                    onChangeText={(text) =>
                                        setCostInput(text.replace(/[^0-9]/g, ""))
                                    }
                                    placeholder="0"
                                    placeholderTextColor={COLORS.textSecondary}
                                />
                            </View>

                            <View style={modalStyles.inputBlock}>
                                <Text style={modalStyles.inputLabel}>
                                    CATATAN (OPSIONAL)
                                </Text>
                                <TextInput
                                    style={[modalStyles.input, modalStyles.inputMultiline]}
                                    value={notesInput}
                                    onChangeText={setNotesInput}
                                    placeholder="Contoh: nama bengkel, kondisi komponen, dll."
                                    placeholderTextColor={COLORS.textSecondary}
                                    multiline
                                />
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.85}
                                style={[
                                    modalStyles.saveButton,
                                    !kmInput && modalStyles.saveButtonDisabled,
                                ]}
                                onPress={handleConfirmServiced}
                                disabled={!kmInput}
                            >
                                <Text style={modalStyles.saveButtonText}>
                                    SIMPAN
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={modalStyles.cancelButton}
                                onPress={() => setShowServiceModal(false)}
                            >
                                <Text style={modalStyles.cancelButtonText}>
                                    Batal
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
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
    headerActions: {
        flexDirection: "row",
        gap: 8,
    },
    headerButtonActive: {
        backgroundColor: COLORS.yellow,
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
    mutedRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    mutedText: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textSecondary,
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

    // Prediction
    predictionCard: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 20,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        gap: 4,
    },
    predictionLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    predictionValue: {
        fontSize: 20,
        fontWeight: "900",
        color: COLORS.textPrimary,
    },
    predictionHint: {
        fontSize: 12,
        fontWeight: "500",
        color: COLORS.textSecondary,
    },

    // History
    historySection: {
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
    historyTitle: {
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: 1,
        color: COLORS.textSecondary,
    },
    historyEmpty: {
        paddingVertical: 8,
    },
    historyEmptyText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    historyItem: {
        borderTopWidth: BORDER_WIDTH.thin,
        borderTopColor: COLORS.border,
        paddingTop: 12,
        gap: 4,
    },
    historyItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    historyDate: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    historyKm: {
        fontSize: 13,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    historyMeta: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    historyNotes: {
        fontSize: 13,
        color: COLORS.textPrimary,
        lineHeight: 18,
    },

    // Service Button (primary CTA)
    serviceButton: {
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
    serviceButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.textPrimary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});

const modalStyles = StyleSheet.create({
    safe: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    container: {
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: COLORS.background,
        borderTopWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 20,
        paddingBottom: 32,
        gap: 14,
    },
    handle: {
        width: 48,
        height: 5,
        borderRadius: 3,
        backgroundColor: COLORS.border,
        alignSelf: "center",
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "900",
        color: COLORS.textPrimary,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 4,
    },
    inputBlock: {
        gap: 6,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary,
        backgroundColor: COLORS.surface,
    },
    inputMultiline: {
        minHeight: 70,
        textAlignVertical: "top",
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 4,
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },
    cancelButton: {
        alignItems: "center",
        paddingVertical: 10,
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textSecondary,
    },
});
