import { useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Animated,
    Alert,
    BackHandler,
} from "react-native";
import { useRouter } from "expo-router";
import {
    ChevronRight,
    Info,
    LogOut,
    Camera,
    Bell,
    BellOff,
    SlidersVertical,
} from "lucide-react-native";
import { COLORS, BORDER_WIDTH } from "@constants/theme";
import { NeoBrutalCard, TabsHeader } from "@components/index";
import {
    useSettingsStore,
    NOTIFICATION_THRESHOLD_OPTIONS,
} from "@store/useSettingsStore";
import { useMotorStore } from "@store/useMotorStore";

export default function SettingsScreen() {
    const router = useRouter();
    const editProfileScale = useRef(new Animated.Value(1)).current;
    const itemScale = useRef(new Animated.Value(1)).current;
    const logoutScale = useRef(new Animated.Value(1)).current;

    const motors = useMotorStore((state) => state.motors);
    const notificationThresholdKm = useSettingsStore(
        (state) => state.notificationThresholdKm,
    );
    const setNotificationThreshold = useSettingsStore(
        (state) => state.setNotificationThreshold,
    );
    const mutedMotorIds = useSettingsStore((state) => state.mutedMotorIds);
    const toggleMuteMotor = useSettingsStore((state) => state.toggleMuteMotor);
    const dailyKmReminderEnabled = useSettingsStore(
        (state) => state.dailyKmReminderEnabled,
    );
    const setDailyKmReminderEnabled = useSettingsStore(
        (state) => state.setDailyKmReminderEnabled,
    );

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const handleExitApp = () => {
        Alert.alert(
            "Keluar Aplikasi",
            "Apakah Anda yakin ingin menutup aplikasi?",
            [
                {
                    text: "Tidak",
                    style: "cancel",
                },
                {
                    text: "Ya",
                    onPress: () => BackHandler.exitApp(),
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.stickyHeader}>
                <TabsHeader title="Pengaturan" />
            </View>

            <View style={styles.content}>
                {/* Profile Section */}
                <NeoBrutalCard style={styles.profileCard}>
                    <View style={styles.profileInfo}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{
                                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz9WrxjCqBnASIXVbxsy8DmiCaklDUWemg75gqHgJaBrPiad3w9R375QRbcNDgsbjxsG3YQiDgoN6RHZU1A3X0Z7tCf8O4MeMQ2l_MzxRlhdmwYzu0KU7GWd-9LXdxL7Kyl4eEeRA6Kjd744oY95gwg3vuMc9B-gcolKWdhex5gpRhrdMBjRJ38hWYAtK_ilvhi7HXFs-GrIkZ3rqMSReOTJiF2Tg9HHGChaGZOyJ06T19kecEW5oGPxJ76lNUAmkUyjtFsaCatRBc",
                                }}
                                style={styles.avatar}
                            />
                            <View style={styles.cameraBadge}>
                                <Camera
                                    size={14}
                                    color={COLORS.textPrimary}
                                    strokeWidth={2.5}
                                />
                            </View>
                        </View>
                        <View style={styles.profileText}>
                            <Text style={styles.userName}>Fatik</Text>
                            <Text style={styles.userEmail}>
                                fatik@gmail.com
                            </Text>
                        </View>
                    </View>

                    <Animated.View
                        style={{ transform: [{ scale: editProfileScale }] }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.editButton}
                            onPress={() => router.push("/settings/edit-profile")}
                            onPressIn={() =>
                                animateButton(editProfileScale, 0.95)
                            }
                            onPressOut={() => animateButton(editProfileScale, 1)}
                        >
                            <Text style={styles.editButtonText}>
                                EDIT PROFIL
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </NeoBrutalCard>

                {/* Notifications */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>NOTIFIKASI</Text>
                </View>

                <NeoBrutalCard style={styles.notifCard}>
                    <Text style={styles.notifLabel}>
                        AMBANG PERINGATAN (SISA KM)
                    </Text>
                    <Text style={styles.notifHint}>
                        Komponen ditandai "Mendekati" saat sisa km-nya kurang
                        dari atau sama dengan angka ini.
                    </Text>
                    <View style={styles.thresholdRow}>
                        {NOTIFICATION_THRESHOLD_OPTIONS.map((option) => {
                            const active = option === notificationThresholdKm;
                            return (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.thresholdChip,
                                        active && styles.thresholdChipActive,
                                    ]}
                                    onPress={() => setNotificationThreshold(option)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.thresholdChipText}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.notifDivider} />

                    <View style={styles.muteMotorRow}>
                        <View style={styles.muteMotorText}>
                            <Text style={styles.notifLabel}>
                                PENGINGAT UPDATE KM HARIAN
                            </Text>
                            <Text style={styles.notifHint}>Setiap jam 18:00</Text>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.muteToggle,
                                dailyKmReminderEnabled && styles.muteToggleOn,
                            ]}
                            onPress={() =>
                                setDailyKmReminderEnabled(!dailyKmReminderEnabled)
                            }
                            activeOpacity={0.8}
                        >
                            {dailyKmReminderEnabled ? (
                                <Bell size={18} color={COLORS.textPrimary} />
                            ) : (
                                <BellOff size={18} color={COLORS.textSecondary} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.notifDivider} />

                    <Text style={styles.notifLabel}>MUTE NOTIFIKASI MOTOR</Text>
                    {motors.length === 0 ? (
                        <Text style={styles.notifHint}>Belum ada motor.</Text>
                    ) : (
                        motors.map((motor) => {
                            const isMuted = mutedMotorIds.includes(motor.id);
                            return (
                                <View key={motor.id} style={styles.muteMotorRow}>
                                    <View style={styles.muteMotorText}>
                                        <Text style={styles.notifHint}>
                                            {motor.name}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[
                                            styles.muteToggle,
                                            isMuted && styles.muteToggleActive,
                                        ]}
                                        onPress={() => toggleMuteMotor(motor.id)}
                                        activeOpacity={0.8}
                                    >
                                        {isMuted ? (
                                            <BellOff
                                                size={18}
                                                color={COLORS.textSecondary}
                                            />
                                        ) : (
                                            <Bell size={18} color={COLORS.textPrimary} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    )}

                    <TouchableOpacity
                        style={styles.manageComponentsLink}
                        onPress={() => router.push("/dashboard/manage-komponen")}
                        activeOpacity={0.8}
                    >
                        <SlidersVertical size={16} color={COLORS.textPrimary} />
                        <Text style={styles.manageComponentsLinkText}>
                            Atur mute per komponen di halaman Atur Komponen
                        </Text>
                        <ChevronRight size={16} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </NeoBrutalCard>

                {/* App Preferences */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>PREFERENSI APLIKASI</Text>
                </View>

                <View style={styles.listContainer}>
                    <Animated.View
                        style={{ transform: [{ scale: itemScale }] }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.listItem}
                            onPress={() => router.push("/settings/about")}
                            onPressIn={() => animateButton(itemScale, 0.98)}
                            onPressOut={() => animateButton(itemScale, 1)}
                        >
                            <View style={styles.listItemLeft}>
                                <View style={styles.iconContainer}>
                                    <Info
                                        size={20}
                                        color={COLORS.primary}
                                        strokeWidth={2.5}
                                    />
                                </View>
                                <Text style={styles.listItemText}>
                                    Tentang Motorin
                                </Text>
                            </View>
                            <ChevronRight
                                size={20}
                                color={COLORS.textSecondary}
                                strokeWidth={2.5}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        style={{ transform: [{ scale: logoutScale }] }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={[styles.listItem, styles.exitItem]}
                            onPress={handleExitApp}
                            onPressIn={() => animateButton(logoutScale, 0.98)}
                            onPressOut={() => animateButton(logoutScale, 1)}
                        >
                            <View style={styles.listItemLeft}>
                                <View style={styles.iconContainer}>
                                    <LogOut
                                        size={20}
                                        color="#ef4444"
                                        strokeWidth={2.5}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.listItemText,
                                        styles.exitText,
                                    ]}
                                >
                                    Keluar Aplikasi
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
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
        marginTop: 6,
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
    profileCard: {
        backgroundColor: COLORS.surface,
        padding: 24,
        marginBottom: 32,
    },
    profileInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        marginBottom: 24,
    },
    avatarContainer: {
        position: "relative",
    },
    avatar: {
        width: 80,
        height: 80,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
    },
    cameraBadge: {
        position: "absolute",
        bottom: -6,
        right: -6,
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 4,
        shadowColor: COLORS.border,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    profileText: {
        flex: 1,
        gap: 4,
    },
    userName: {
        fontSize: 22,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    userEmail: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.textSecondary,
    },
    editButton: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingVertical: 14,
        alignItems: "center",
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textPrimary,
        letterSpacing: 1,
    },
    sectionHeader: {
        marginBottom: 16,
        paddingLeft: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textSecondary,
        letterSpacing: 1.5,
    },
    notifCard: {
        backgroundColor: COLORS.surface,
        padding: 20,
        marginBottom: 32,
        gap: 4,
    },
    notifLabel: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },
    notifHint: {
        fontSize: 13,
        fontWeight: "500",
        color: COLORS.textSecondary,
        lineHeight: 18,
        marginBottom: 12,
    },
    thresholdRow: {
        flexDirection: "row",
        gap: 10,
    },
    thresholdChip: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    thresholdChipActive: {
        backgroundColor: COLORS.primary,
    },
    thresholdChipText: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    notifDivider: {
        height: 2,
        backgroundColor: COLORS.border,
        marginVertical: 20,
    },
    muteMotorRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 10,
    },
    muteMotorText: {
        flex: 1,
        gap: 4,
    },
    muteToggle: {
        width: 44,
        height: 44,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.surface,
    },
    muteToggleOn: {
        backgroundColor: COLORS.primary,
    },
    muteToggleActive: {
        backgroundColor: "#f3f4f6",
    },
    manageComponentsLink: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: BORDER_WIDTH.thin,
        borderTopColor: COLORS.border,
    },
    manageComponentsLinkText: {
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    listContainer: {
        gap: 16,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 16,
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    exitItem: {
        backgroundColor: "#fee2e2", // Light red
    },
    listItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    iconContainer: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    listItemText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    exitText: {
        color: "#b91c1c", // Darker red
    },
    versionContainer: {
        marginTop: 48,
        alignItems: "center",
        gap: 4,
    },
    versionText: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textSecondary,
        opacity: 0.6,
    },
    madeByText: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textSecondary,
        opacity: 0.6,
    },
});
