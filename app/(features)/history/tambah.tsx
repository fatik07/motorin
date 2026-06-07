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
import { ArrowLeft } from "lucide-react-native";

import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import { NeoBrutalCard } from "@components/index";

export default function AddServiceScreen() {
    const router = useRouter();

    const backButtonScale = useRef(new Animated.Value(1)).current;

    const [form, setForm] = useState({
        title: "",
        date: "",
        odometer: "",
        description: "",
        cost: "",
    });

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const handleSave = () => {
        if (!form.title || !form.date) {
            Alert.alert("Error", "Nama servis dan tanggal wajib diisi");
            return;
        }

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
                    <Text style={styles.label}>Nama Servis</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ganti Oli Mesin"
                        value={form.title}
                        onChangeText={(t) => setForm({ ...form, title: t })}
                    />
                </NeoBrutalCard>

                <NeoBrutalCard>
                    <Text style={styles.label}>Tanggal</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="12 Okt 2023"
                        value={form.date}
                        onChangeText={(t) => setForm({ ...form, date: t })}
                    />
                </NeoBrutalCard>

                <NeoBrutalCard>
                    <Text style={styles.label}>Odometer</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="10.000 km"
                        value={form.odometer}
                        onChangeText={(t) => setForm({ ...form, odometer: t })}
                    />
                </NeoBrutalCard>

                <NeoBrutalCard>
                    <Text style={styles.label}>Deskripsi</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Detail servis"
                        value={form.description}
                        onChangeText={(t) =>
                            setForm({ ...form, description: t })
                        }
                    />
                </NeoBrutalCard>

                <NeoBrutalCard>
                    <Text style={styles.label}>Biaya</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Rp 150.000"
                        value={form.cost}
                        onChangeText={(t) => setForm({ ...form, cost: t })}
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
