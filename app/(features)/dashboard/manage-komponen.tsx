import { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert,
    Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, BORDER_WIDTH } from "@constants/theme";
import { Pin, Eye, EyeOff, Plus, ArrowLeft } from "lucide-react-native";
import { useComponentStore } from "@store/useComponentStore";

const MAX_PINNED = 5;

export default function ManageDashboard() {
    const router = useRouter();
    const components = useComponentStore((state) => state.components);
    const togglePin = useComponentStore((state) => state.togglePin);
    const toggleHidden = useComponentStore((state) => state.toggleHidden);
    const addCustomComponent = useComponentStore(
        (state) => state.addCustomComponent,
    );

    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newIntervalKm, setNewIntervalKm] = useState("");

    const backButtonScale = useRef(new Animated.Value(1)).current;

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const pinnedCount = components.filter((c) => c.isPinned).length;

    const handleTogglePin = (id: string) => {
        const ok = togglePin(id);
        if (!ok) {
            Alert.alert(
                "Batas Pin Tercapai",
                `Maksimal ${MAX_PINNED} komponen bisa di-pin ke dashboard. Lepas pin komponen lain terlebih dahulu.`,
            );
        }
    };

    const handleAddComponent = () => {
        const intervalKm = parseInt(newIntervalKm.replace(/[^0-9]/g, ""), 10);

        if (!newName.trim()) {
            Alert.alert("Nama kosong", "Masukkan nama komponen.");
            return;
        }
        if (!intervalKm || intervalKm <= 0) {
            Alert.alert("Interval tidak valid", "Masukkan interval km lebih dari 0.");
            return;
        }

        addCustomComponent({ name: newName.trim(), intervalKm });
        setNewName("");
        setNewIntervalKm("");
        setAdding(false);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        onPressIn={() => animateButton(backButtonScale, 0.9)}
                        onPressOut={() => animateButton(backButtonScale, 1)}
                        activeOpacity={1}
                    >
                        <ArrowLeft size={20} color={COLORS.textPrimary} strokeWidth={2.5} />
                    </TouchableOpacity>
                </Animated.View>
                <Text style={styles.title}>Atur Komponen</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.intro}>
                <Text style={styles.introText}>
                    Pin komponen untuk ditampilkan di dashboard (maksimal{" "}
                    {MAX_PINNED}), atau sembunyikan komponen yang tidak relevan.
                </Text>
                <Text style={styles.pinnedCount}>
                    Pinned: {pinnedCount}/{MAX_PINNED}
                </Text>
            </View>

            <View style={styles.controlsRow}>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => setAdding((v) => !v)}
                >
                    <View style={styles.manageRow}>
                        <Plus
                            size={18}
                            color={COLORS.textPrimary}
                            strokeWidth={2.4}
                        />
                        <Text style={styles.addBtnText}>Tambah Komponen</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {adding && (
                <View style={styles.addBlock}>
                    <TextInput
                        placeholder="Nama komponen"
                        value={newName}
                        onChangeText={setNewName}
                        style={styles.input}
                        placeholderTextColor={COLORS.textSecondary}
                    />
                    <TextInput
                        placeholder="Interval km (contoh: 5000)"
                        value={newIntervalKm}
                        onChangeText={(text) =>
                            setNewIntervalKm(text.replace(/[^0-9]/g, ""))
                        }
                        keyboardType="number-pad"
                        style={styles.input}
                        placeholderTextColor={COLORS.textSecondary}
                    />
                    <View style={styles.addActions}>
                        <TouchableOpacity
                            style={styles.smallBtn}
                            onPress={() => setAdding(false)}
                        >
                            <Text style={styles.smallBtnText}>Batal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.smallPrimary}
                            onPress={handleAddComponent}
                        >
                            <Text style={styles.smallPrimaryText}>Tambah</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList
                data={components}
                keyExtractor={(i) => i.id}
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <View style={styles.rowText}>
                            <Text style={styles.rowTitle}>{item.name}</Text>
                            <Text style={styles.rowInterval}>
                                Setiap {item.intervalKm.toLocaleString("id-ID")} km
                                {item.isCustom ? " • Custom" : ""}
                            </Text>
                        </View>

                        <View style={styles.rowActions}>
                            <TouchableOpacity
                                onPress={() => handleTogglePin(item.id)}
                                disabled={item.isHidden}
                                style={[
                                    styles.iconToggle,
                                    item.isPinned && styles.iconToggleActive,
                                    item.isHidden && styles.iconToggleDisabled,
                                ]}
                            >
                                <Pin
                                    size={16}
                                    color={
                                        item.isPinned
                                            ? COLORS.textPrimary
                                            : COLORS.textSecondary
                                    }
                                    fill={item.isPinned ? COLORS.primary : "none"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => toggleHidden(item.id)}
                                style={styles.iconToggle}
                            >
                                {item.isHidden ? (
                                    <EyeOff size={16} color={COLORS.textSecondary} />
                                ) : (
                                    <Eye size={16} color={COLORS.textPrimary} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
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
    title: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
    intro: { padding: 20, gap: 6 },
    introText: { color: COLORS.textSecondary },
    pinnedCount: { color: COLORS.textPrimary, fontWeight: "800" },
    controlsRow: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    manageRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    addBtn: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 12,
        alignItems: "center",
    },
    addBtnText: { fontWeight: "800", color: COLORS.textPrimary },
    addBlock: { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
    input: {
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 10,
    },
    addActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
    smallBtn: {
        padding: 8,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
    },
    smallBtnText: { color: COLORS.textPrimary },
    smallPrimary: {
        padding: 8,
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
    },
    smallPrimaryText: { color: COLORS.textPrimary, fontWeight: "800" },
    row: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 12,
        marginBottom: 12,
    },
    rowText: { flex: 1 },
    rowTitle: { fontWeight: "800", color: COLORS.textPrimary },
    rowInterval: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
    rowActions: { flexDirection: "row", alignItems: "center", gap: 8 },
    iconToggle: {
        width: 36,
        height: 36,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },
    iconToggleActive: {
        backgroundColor: COLORS.primary,
    },
    iconToggleDisabled: {
        opacity: 0.4,
    },
});
