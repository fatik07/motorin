import React, { useRef, useState } from "react";
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
import { ArrowUp, ArrowDown, Plus } from "lucide-react-native";

interface Item {
    id: string;
    name: string;
    category?: string;
    active: boolean;
    image?: string;
}

const initialItems: Item[] = [
    {
        id: "oil",
        name: "Oli Mesin",
        category: "Mesin & Transmisi",
        active: true,
    },
    {
        id: "front-tire",
        name: "Ban Depan",
        category: "Keamanan & Roda",
        active: true,
    },
    {
        id: "rear-tire",
        name: "Ban Belakang",
        category: "Keamanan & Roda",
        active: true,
    },
    {
        id: "battery",
        name: "Aki (Battery)",
        category: "Kelistrikan",
        active: false,
    },
    {
        id: "v-belt",
        name: "V-Belt / Rantai",
        category: "Transmisi",
        active: true,
    },
];

export default function ManageDashboard() {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const router = useRouter();
    const saveButtonScale = useRef(new Animated.Value(1)).current;

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const toggleActive = (id: string) => {
        setItems((cur) =>
            cur.map((it) =>
                it.id === id ? { ...it, active: !it.active } : it,
            ),
        );
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        setItems((cur) => {
            const arr = [...cur];
            const tmp = arr[index - 1];
            arr[index - 1] = arr[index];
            arr[index] = tmp;
            return arr;
        });
    };

    const moveDown = (index: number) => {
        if (index === items.length - 1) return;
        setItems((cur) => {
            const arr = [...cur];
            const tmp = arr[index + 1];
            arr[index + 1] = arr[index];
            arr[index] = tmp;
            return arr;
        });
    };

    const addItem = () => {
        if (!newName.trim()) {
            Alert.alert("Nama kosong", "Masukkan nama komponen.");
            return;
        }

        const id = newName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");
        setItems((cur) => [{ id, name: newName.trim(), active: true }, ...cur]);
        setNewName("");
        setAdding(false);
    };

    const handleSave = () => {
        Alert.alert(
            "Berhasil",
            "Perubahan komponen telah berhasil disimpan.",
            [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ],
            { cancelable: false },
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.closeBtn}
                >
                    <Text style={styles.closeX}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Atur Komponen</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.intro}>
                <Text style={styles.introText}>
                    Tarik dan lepaskan untuk mengurutkan, atau gunakan tombol
                    naik/turun untuk mengubah urutan. Gunakan saklar untuk
                    menampilkan/menyembunyikan komponen.
                </Text>
            </View>

            <View style={styles.controlsRow}>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => setAdding(true)}
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
                            onPress={addItem}
                        >
                            <Text style={styles.smallPrimaryText}>Tambah</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList
                data={items}
                keyExtractor={(i) => i.id}
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item, index }) => (
                    <View style={styles.row}>
                        <View style={styles.dragHandle}>
                            <Text style={styles.dragDots}>⋮⋮</Text>
                        </View>

                        <View style={styles.rowText}>
                            <Text style={styles.rowTitle}>{item.name}</Text>
                            {item.category && (
                                <Text style={styles.rowCategory}>
                                    {item.category}
                                </Text>
                            )}
                        </View>

                        <View style={styles.rowActions}>
                            <TouchableOpacity
                                onPress={() => moveUp(index)}
                                style={styles.iconBtn}
                            >
                                <ArrowUp size={18} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => moveDown(index)}
                                style={styles.iconBtn}
                            >
                                <ArrowDown
                                    size={18}
                                    color={COLORS.textPrimary}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => toggleActive(item.id)}
                                style={[
                                    styles.toggle,
                                    item.active
                                        ? styles.toggleOn
                                        : styles.toggleOff,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.toggleDot,
                                        item.active && styles.toggleDotOn,
                                    ]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <Animated.View
                style={{
                    transform: [{ scale: saveButtonScale }],
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.saveButton}
                    onPress={handleSave}
                    onPressIn={() => animateButton(saveButtonScale, 0.95)}
                    onPressOut={() => animateButton(saveButtonScale, 1)}
                >
                    <Text style={styles.saveButtonText}>SIMPAN PERUBAHAN</Text>
                </TouchableOpacity>
            </Animated.View>
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
    closeBtn: {
        width: 30,
        height: 30,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },
    closeX: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
    title: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
    intro: { padding: 20 },
    introText: { color: COLORS.textSecondary },
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
    addBlock: { paddingHorizontal: 20, paddingBottom: 12 },
    input: {
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 10,
        marginBottom: 8,
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
    dragHandle: { width: 32, alignItems: "center", justifyContent: "center" },
    dragDots: { fontSize: 16, color: COLORS.textSecondary },
    rowText: { flex: 1 },
    rowTitle: { fontWeight: "800", color: COLORS.textPrimary },
    rowCategory: { color: COLORS.textSecondary, fontSize: 12 },
    rowActions: { flexDirection: "row", alignItems: "center", gap: 8 },
    iconBtn: { padding: 8 },
    toggle: {
        width: 56,
        height: 28,
        borderRadius: 14,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        marginLeft: 12,
        justifyContent: "center",
        padding: 4,
    },
    toggleOn: { backgroundColor: COLORS.secondary },
    toggleOff: { backgroundColor: COLORS.thirdary },
    toggleDot: {
        width: 18,
        height: 18,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        alignSelf: "flex-start",
    },
    toggleDotOn: { alignSelf: "flex-end", backgroundColor: COLORS.info },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingVertical: 18,
        alignItems: "center",
        marginBottom: 30,
        marginHorizontal: 20,
    },
    saveButtonText: { fontWeight: "800", color: COLORS.textPrimary },
});
