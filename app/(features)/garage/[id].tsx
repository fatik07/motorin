import { useRef } from "react";
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
import { ArrowLeft, Gauge, Wrench } from "lucide-react-native";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import { GARAGE_MOTORS } from "@constants/motors";

export default function GarageMotorDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const backButtonScale = useRef(new Animated.Value(1)).current;

    const motor = GARAGE_MOTORS.find((m) => m.id === id);

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
                    <Image source={{ uri: motor.image }} style={styles.image} />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{motor.type}</Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.brand}>{motor.brand}</Text>
                    <Text style={styles.name}>{motor.name}</Text>

                    <View style={styles.grid}>
                        <View style={styles.box}>
                            <Gauge size={16} color={COLORS.textSecondary} />
                            <Text style={styles.label}>Odometer</Text>
                            <Text style={styles.value}>{motor.odometer}</Text>
                        </View>

                        <View style={[styles.box, styles.boxAccent]}>
                            <Wrench size={16} color={COLORS.primary} />
                            <Text style={[styles.label, { color: COLORS.primary }]}>
                                {motor.type === "ELECTRIC"
                                    ? "Status Baterai"
                                    : "Servis Terakhir"}
                            </Text>
                            <Text style={[styles.value, { color: COLORS.primary }]}>
                                {motor.lastService}
                            </Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 16 }}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.label}>{motor.progressLabel}</Text>
                            <Text style={styles.label}>{motor.progress}%</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${motor.progress}%` },
                                ]}
                            />
                        </View>
                    </View>
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
    },
    brand: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.textSecondary,
    },
    name: {
        fontSize: 22,
        fontWeight: "900",
        color: COLORS.textPrimary,
        marginBottom: 16,
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
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
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
});
