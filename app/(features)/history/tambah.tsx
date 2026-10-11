import { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Animated,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";

import { COLORS, BORDER_WIDTH } from "@constants/theme";
import { NeoBrutalCard } from "@components/index";
import { useComponentStore } from "@store/useComponentStore";

export default function AddServiceScreen() {
    const router = useRouter();

    const backButtonScale = useRef(new Animated.Value(1)).current;

    const components = useComponentStore((state) => state.components);
    const currentKm = useComponentStore((state) => state.currentKm);
    const markServiced = useComponentStore((state) => state.markServiced);

    const [componentId, setComponentId] = useState<string | null>(null);
    const [kmInput, setKmInput] = useState(currentKm.toString());
    const [brandInput, setBrandInput] = useState("");
    const [costInput, setCostInput] = useState("");
    const [notesInput, setNotesInput] = useState("");

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const handleSave = () => {
        if (!componentId) {
            Alert.alert("Error", "Pilih komponen yang diservis terlebih dahulu.");
            return;
        }
        const serviceKm = parseInt(kmInput.replace(/[^0-9]/g, ""), 10);
        if (!serviceKm || serviceKm <= 0) {
            Alert.alert("Error", "Masukkan km yang valid.");
            return;
        }

        markServiced(componentId, {
            serviceKm,
            brandUsed: brandInput.trim() || undefined,
            cost: costInput ? parseInt(costInput.replace(/[^0-9]/g, ""), 10) : undefined,
            notes: notesInput.trim() || undefined,
        });

        Alert.alert("Sukses", "Data servis berhasil disimpan", [
            {
                text: "OK",
                onPress: () => router.back(),
            },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* HEADER CUSTOM */}
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

                <Text style={styles.title}>Tambah Servis</Text>

                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <NeoBrutalCard>
                    <Text style={styles.label}>Komponen</Text>
                    <View style={styles.pickerList}>
                        {components.map((component) => {
                            const selected = component.id === componentId;
                            return (
                                <TouchableOpacity
                                    key={component.id}
                                    style={[
                                        styles.pickerRow,
                                        selected && styles.pickerRowSelected,
                                    ]}
                                    onPress={() => setComponentId(component.id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.pickerRowText}>
                                        {component.name}
                                    </Text>
                                    {selected && (
                                        <Check
                                            size={16}
                                            color={COLORS.textPrimary}
                                            strokeWidth={3}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </NeoBrutalCard>

                <NeoBrutalCard>
                    <Text style={styles.label}>Km Saat Penggantian</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="10000"
                        keyboardType="number-pad"
                        value={kmInput}
                        onChangeText={(t) =>
                            setKmInput(t.replace(/[^0-9]/g, ""))
                        }
                    />
                </NeoBrutalCard>

                <NeoBrutalCard>
                    <Text style={styles.label}>Merek / Produk (Opsional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Castrol Power1 10W-40"
                        value={brandInput}
                        onChangeText={setBrandInput}
                    />
                </NeoBrutalCard>

                <NeoBrutalCard>
                    <Text style={styles.label}>Biaya (Opsional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="150000"
                        keyboardType="number-pad"
                        value={costInput}
                        onChangeText={(t) =>
                            setCostInput(t.replace(/[^0-9]/g, ""))
                        }
                    />
                </NeoBrutalCard>

                <NeoBrutalCard>
                    <Text style={styles.label}>Catatan (Opsional)</Text>
                    <TextInput
                        style={[styles.input, styles.inputMultiline]}
                        placeholder="Nama bengkel, kondisi komponen, dll."
                        value={notesInput}
                        onChangeText={setNotesInput}
                        multiline
                    />
                </NeoBrutalCard>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveText}>SIMPAN</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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

    content: {
        padding: 20,
        gap: 16,
        paddingBottom: 40,
    },

    label: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.textSecondary,
        marginBottom: 8,
        textTransform: "uppercase",
    },

    input: {
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 12,
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
        backgroundColor: COLORS.surface,
    },

    inputMultiline: {
        minHeight: 70,
        textAlignVertical: "top",
    },

    pickerList: {
        gap: 8,
    },

    pickerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 12,
        backgroundColor: COLORS.surface,
    },

    pickerRowSelected: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
    },

    pickerRowText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },

    saveButton: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 16,
        alignItems: "center",
    },

    saveText: {
        fontSize: 16,
        fontWeight: "900",
        color: COLORS.textPrimary,
        letterSpacing: 1,
    },
});
