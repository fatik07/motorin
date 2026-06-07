import { useRef } from "react";
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
import { Plus } from "lucide-react-native";
import { COLORS, BORDER_WIDTH } from "@constants/theme";
import { TabsHeader } from "@components/index";

type Motor = {
    id: string;
    brand: string;
    name: string;
    image: string;
    odometer: string;
    lastService: string;
    type: "ICE" | "ELECTRIC";
    progressLabel: string;
    progress: number;
};

const MOTORS: Motor[] = [
    {
        id: "1",
        brand: "HONDA",
        name: "Vario 125",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYksOYFGfbU9YUwQ9sA_Cj_9ZdiGcs7xWwcwRlXRGv43DzZQvvYNypQorKvrHQ19BgrG2wib_6_x_fT4jIX8idROFGNhoXOVwtKPjx9_tPxHFWIjp3wEZjto-YPW0aTs_wYmdK6jHk-ZLdlJfgpncT9_hVzNrm4G5YIsd9LibCZwJaELdS_zAayEu7K9hiRLcpZEi9o3T1FrMi88mPjc45iva29-ScOCORRASvpdCGqh5q3zkJUUv6SKeBKpV1az8BYJStTT1cshM2",
        odometer: "12.450 km",
        lastService: "12 Oct 23",
        type: "ICE",
        progressLabel: "Oil Life",
        progress: 80,
    },
    {
        id: "2",
        brand: "ALVA",
        name: "Alva One",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKqYPlAacJFlGnPcOxm7fUAA_lT_sKbm5NR0zqZeDaqXO9-oosBdsXXyVg-0vFr7lpG0QPOCxR9McK7KpAmgjfR-YkFaOYfxnnKe1MSvf8x_irMk4iyhHGOWwRbRS2gN6hKw6LtVfaxUvulElcgsN9SR5osQjQeWzVEpZFNjhf3x5-ETKxL2_0u6d6qnQQQBn0_ZycTGCcjF4FmjOrCQq62Y_KyOo5D3HkGOm5F1PKzhelYna5YWEq7eRouzCugs2h0VSRmjLZr6Bi",
        odometer: "2.100 km",
        lastService: "Battery 94%",
        type: "ELECTRIC",
        progressLabel: "Battery Health",
        progress: 94,
    },
];

export default function GarageScreen() {
    const router = useRouter();

    // ✅ FIX: per-card animation (bukan shared)
    const scales = useRef(MOTORS.map(() => new Animated.Value(1))).current;
    const fabScale = useRef(new Animated.Value(1)).current;

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
                    <Text style={styles.title}>My Garage</Text>
                    <Text style={styles.subtitle}>
                        You have {MOTORS.length} vehicles active.
                    </Text>
                </View>

                {/* MOTOR LIST */}
                <View style={{ gap: 16 }}>
                    {MOTORS.map((motor, index) => (
                        <Animated.View
                            key={motor.id}
                            style={{
                                transform: [{ scale: scales[index] }],
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={1}
                                onPressIn={() => animate(scales[index], 0.97)}
                                onPressOut={() => animate(scales[index], 1)}
                                onPress={() =>
                                    router.push(`/garage/${motor.id}`)
                                }
                            >
                                <View style={styles.card}>
                                    {/* IMAGE */}
                                    <View style={styles.imageBox}>
                                        <Image
                                            source={{
                                                uri: motor.image,
                                            }}
                                            style={styles.image}
                                        />

                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>
                                                {motor.type}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* CONTENT */}
                                    <View style={styles.body}>
                                        <View style={styles.headerRow}>
                                            <View>
                                                <Text style={styles.brand}>
                                                    {motor.brand}
                                                </Text>
                                                <Text style={styles.name}>
                                                    {motor.name}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* INFO */}
                                        <View style={styles.grid}>
                                            <View style={styles.box}>
                                                <Text style={styles.label}>
                                                    Odometer
                                                </Text>
                                                <Text style={styles.value}>
                                                    {motor.odometer}
                                                </Text>
                                            </View>

                                            <View
                                                style={[
                                                    styles.box,
                                                    styles.boxAccent,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.label,
                                                        {
                                                            color: COLORS.primary,
                                                        },
                                                    ]}
                                                >
                                                    Last Service
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.value,
                                                        {
                                                            color: COLORS.primary,
                                                        },
                                                    ]}
                                                >
                                                    {motor.lastService}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* PROGRESS */}
                                        <View style={{ marginTop: 12 }}>
                                            <View style={styles.progressHeader}>
                                                <Text style={styles.label}>
                                                    {motor.progressLabel}
                                                </Text>
                                                <Text style={styles.label}>
                                                    {motor.progress}%
                                                </Text>
                                            </View>

                                            <View style={styles.progressBar}>
                                                <View
                                                    style={[
                                                        styles.progressFill,
                                                        {
                                                            width: `${motor.progress}%`,
                                                        },
                                                    ]}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
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
                    onPress={() => {
                        alert("Tambah Motor");
                    }}
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

    body: {
        padding: 16,
    },

    headerRow: {
        marginBottom: 12,
    },

    brand: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.textSecondary,
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
