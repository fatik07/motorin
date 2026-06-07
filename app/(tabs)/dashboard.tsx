import { useMemo, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Bike, Gauge, Pencil, SlidersVertical } from "lucide-react-native";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import { ComponentCard, NeoBrutalCard, TabsHeader } from "@components/index";
import type { ComponentWithStatus } from "../../src/types";
import {
    Modal,
    TextInput,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from "react-native";
import { useRouter } from "expo-router";

const primaryComponents: ComponentWithStatus[] = [
    {
        id: "oil",
        motorId: "motor-1",
        name: "Oli Mesin",
        category: "engine",
        status: "critical",
        installKm: 11950,
        lifespan: 3000,
        remainingKm: 500,
        progressPercentage: 85,
    },
    {
        id: "front-tire",
        motorId: "motor-1",
        name: "Ban Depan",
        category: "tire",
        status: "good",
        installKm: 4250,
        lifespan: 15000,
        remainingKm: 8200,
        progressPercentage: 45,
    },
    {
        id: "rear-tire",
        motorId: "motor-1",
        name: "Ban Belakang",
        category: "tire",
        status: "warning",
        installKm: 4250,
        lifespan: 12000,
        remainingKm: 3400,
        progressPercentage: 72,
    },
    {
        id: "brake",
        motorId: "motor-1",
        name: "Rem",
        category: "brake",
        status: "warning",
        installKm: 8000,
        lifespan: 10000,
        remainingKm: 1200,
        progressPercentage: 88,
    },
    {
        id: "air-filter",
        motorId: "motor-1",
        name: "Filter Udara",
        category: "engine",
        status: "good",
        installKm: 7450,
        lifespan: 10000,
        remainingKm: 5000,
        progressPercentage: 50,
    },
];

export default function DashboardScreen() {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const router = useRouter();

    const closeButtonScale = useRef(new Animated.Value(1)).current;
    const saveButtonScale = useRef(new Animated.Value(1)).current;
    const updateButtonScale = useRef(new Animated.Value(1)).current;

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const heroData = useMemo(
        () => ({
            name: "Vario Kesayangan",
            km: "12.450 km",
        }),
        [],
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.stickyHeader}>
                <TabsHeader title="Dashboard" />
            </View>

            {/* Update KM Modal */}
            <Modal
                visible={showUpdateModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowUpdateModal(false)}
            >
                <SafeAreaView style={modalStyles.safe}>
                    <KeyboardAvoidingView
                        style={modalStyles.container}
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >
                        <View style={modalStyles.sheet}>
                            <View style={modalStyles.handle} />

                            <View style={modalStyles.headerRow}>
                                <Text style={modalStyles.title}>
                                    UPDATE ODOMETER
                                </Text>
                                <Animated.View
                                    style={{
                                        transform: [
                                            { scale: closeButtonScale },
                                        ],
                                    }}
                                >
                                    <TouchableOpacity
                                        style={modalStyles.closeButton}
                                        onPress={() =>
                                            setShowUpdateModal(false)
                                        }
                                        onPressIn={() =>
                                            animateButton(
                                                closeButtonScale,
                                                0.95,
                                            )
                                        }
                                        onPressOut={() =>
                                            animateButton(closeButtonScale, 1)
                                        }
                                        activeOpacity={1}
                                    >
                                        <Text style={modalStyles.closeX}>
                                            ✕
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>

                            <Text style={modalStyles.subtitle}>
                                Masukkan jarak tempuh motor Anda saat ini.
                            </Text>

                            <View style={modalStyles.lastRecordedRow}>
                                <Text style={modalStyles.lastLabel}>
                                    Kilometer Terakhir
                                </Text>
                                <Text style={modalStyles.lastValue}>
                                    12,450 KM
                                </Text>
                            </View>

                            <View style={modalStyles.inputBlock}>
                                <Text style={modalStyles.inputLabel}>
                                    KILOMETER BARU
                                </Text>
                                <View style={modalStyles.inputWrapper}>
                                    <TextInput
                                        keyboardType="number-pad"
                                        style={modalStyles.input}
                                        placeholder="000000"
                                        placeholderTextColor={
                                            COLORS.textSecondary
                                        }
                                    />
                                    <Text style={modalStyles.inputUnit}>
                                        KM
                                    </Text>
                                </View>
                            </View>

                            <Animated.View
                                style={{
                                    transform: [{ scale: saveButtonScale }],
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={modalStyles.saveButton}
                                    onPress={() => setShowUpdateModal(false)}
                                    onPressIn={() =>
                                        animateButton(saveButtonScale, 0.95)
                                    }
                                    onPressOut={() =>
                                        animateButton(saveButtonScale, 1)
                                    }
                                >
                                    <Text style={modalStyles.saveButtonText}>
                                        SIMPAN PERUBAHAN
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>

            <View style={styles.content}>
                <NeoBrutalCard style={styles.heroCard}>
                    <View style={styles.heroContent}>
                        <View style={styles.heroTextBlock}>
                            <Text style={styles.heroTitle}>
                                {heroData.name}
                            </Text>
                            <View style={styles.heroKmRow}>
                                <Gauge
                                    size={20}
                                    color={COLORS.textPrimary}
                                    strokeWidth={2.2}
                                />
                                <Text style={styles.heroKmText}>
                                    {heroData.km}
                                </Text>
                            </View>
                        </View>

                        <Animated.View
                            style={{
                                transform: [{ scale: updateButtonScale }],
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.updateButton}
                                onPress={() => setShowUpdateModal(true)}
                                onPressIn={() =>
                                    animateButton(updateButtonScale, 0.95)
                                }
                                onPressOut={() =>
                                    animateButton(updateButtonScale, 1)
                                }
                            >
                                <Pencil
                                    size={18}
                                    color={COLORS.textPrimary}
                                    strokeWidth={2.4}
                                />
                                <Text style={styles.updateButtonText}>
                                    Update KM
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    <Bike
                        size={110}
                        color={COLORS.primary}
                        strokeWidth={1.8}
                        style={styles.heroWatermark}
                    />
                </NeoBrutalCard>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Komponen Utama</Text>
                    <Text style={styles.sectionSubtitle}>5 item</Text>
                </View>

                <View style={styles.list}>
                    {primaryComponents.map((component) => (
                        <ComponentCard
                            key={component.id}
                            component={component}
                            onPress={() =>
                                router.push({
                                    pathname: `/dashboard/${component.id}`,
                                    params: {
                                        data: JSON.stringify(component),
                                    },
                                })
                            }
                        />
                    ))}
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.manageButton}
                    onPress={() => router.push("/dashboard/manage-komponen")}
                >
                    <View style={styles.manageRow}>
                        <SlidersVertical
                            size={18}
                            color={COLORS.textPrimary}
                            strokeWidth={2.4}
                        />
                        <Text style={styles.manageTitle}>Komponen Lainnya</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    contentContainer: {
        paddingBottom: 50,
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
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 18,
    },
    heroCard: {
        backgroundColor: COLORS.primary,
        marginBottom: 20,
        padding: 20,
        position: "relative",
        overflow: "hidden",
    },
    heroContent: {
        position: "relative",
        zIndex: 2,
        gap: 18,
    },
    heroTextBlock: {
        gap: 8,
        alignSelf: "flex-start",
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: COLORS.textPrimary,
        letterSpacing: -0.4,
    },
    heroKmRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    heroKmText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    updateButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        alignSelf: "stretch",
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingVertical: 16,
        paddingHorizontal: 18,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    heroWatermark: {
        position: "absolute",
        right: -8,
        bottom: -6,
        opacity: 0.14,
        transform: [{ rotate: "12deg" }],
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    sectionSubtitle: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textSecondary,
        letterSpacing: 0.4,
        textTransform: "uppercase",
    },
    list: {
        flexDirection: "column",
        marginBottom: 20,
        gap: 0,
    },
    collapseCard: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        marginBottom: 24,
    },
    collapseHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 18,
    },
    collapseTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    collapseIcon: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    collapseTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    extraList: {
        borderTopWidth: BORDER_WIDTH.thin,
        borderTopColor: COLORS.border,
    },
    extraRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    extraRowDivider: {
        borderBottomWidth: BORDER_WIDTH.thin,
        borderBottomColor: "#d4d4d4",
    },
    extraTextBlock: {
        flex: 1,
        gap: 2,
    },
    extraTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    extraDescription: {
        fontSize: 12,
        fontWeight: "500",
        color: COLORS.textSecondary,
    },
    extraBadge: {
        minWidth: 84,
        alignItems: "center",
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    safeBadge: {
        backgroundColor: "#86efac",
    },
    warningBadge: {
        backgroundColor: "#fde047",
    },
    dangerBadge: {
        backgroundColor: "#fecaca",
    },
    extraBadgeText: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    manageButton: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 14,
        marginTop: 8,
    },
    manageRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    manageTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
    manageSubtitle: { fontSize: 12, color: COLORS.textSecondary },
});

const modalStyles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
    container: { flex: 1, justifyContent: "flex-end" },
    sheet: {
        backgroundColor: COLORS.surface,
        borderTopWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 28,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
    },
    handle: {
        width: 56,
        height: 6,
        backgroundColor: COLORS.textSecondary,
        borderRadius: 6,
        alignSelf: "center",
        marginBottom: 30,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: { fontSize: 22, fontWeight: "800", color: COLORS.textPrimary },
    closeButton: {
        width: 40,
        height: 40,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },
    closeX: { fontSize: 18, color: COLORS.textPrimary, fontWeight: "800" },
    subtitle: { marginTop: 8, color: COLORS.textSecondary, marginBottom: 12 },
    lastRecordedRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 12,
        marginBottom: 16,
    },
    lastLabel: { fontWeight: "800", color: COLORS.textSecondary },
    lastValue: { fontWeight: "800", color: COLORS.textPrimary },
    inputBlock: { marginBottom: 20 },
    inputLabel: {
        fontWeight: "800",
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    inputWrapper: {
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingVertical: 18,
        paddingHorizontal: 14,
        justifyContent: "center",
    },
    input: { fontSize: 28, textAlign: "center", color: COLORS.textPrimary },
    inputUnit: {
        position: "absolute",
        right: 14,
        top: "50%",
        transform: [{ translateY: -12 }],
        color: COLORS.textSecondary,
        fontWeight: "700",
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingVertical: 18,
        alignItems: "center",
        marginTop: 30,
    },
    saveButtonText: { fontWeight: "800", color: COLORS.textPrimary },
});
