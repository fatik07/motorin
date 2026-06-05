import { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Animated,
    Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import type { ComponentWithStatus } from "../../../src/types";

export default function EditComponentScreen() {
    const router = useRouter();
    const { data } = useLocalSearchParams<{ data: string }>();
    const saveButtonScale = useRef(new Animated.Value(1)).current;
    const deleteButtonScale = useRef(new Animated.Value(1)).current;
    const backButtonScale = useRef(new Animated.Value(1)).current;

    const component: ComponentWithStatus = data
        ? JSON.parse(data)
        : {
              id: "",
              motorId: "",
              name: "Unknown",
              category: "other",
              status: "good",
              remainingKm: 0,
              progressPercentage: 0,
          };

    const [lifespan, setLifespan] = useState(
        (component.lifespan ?? 0).toString(),
    );

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const formatNumber = (num: number) =>
        num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    const parsedLifespan = parseInt(lifespan.replace(/\./g, ""), 10) || 0;
    const targetKm = (component.installKm ?? 0) + parsedLifespan;
    const newRemainingKm = Math.max(
        0,
        targetKm -
            (component.installKm ?? 0) -
            (component.progressPercentage / 100) * (component.lifespan ?? 1),
    );

    const handleSave = () => {
        if (parsedLifespan <= 0) {
            Alert.alert("Error", "Interval ganti harus lebih dari 0 km.");
            return;
        }
        // TODO: save to database
        Alert.alert("Berhasil", "Komponen berhasil diperbarui.", [
            { text: "OK", onPress: () => router.replace("/dashboard") },
        ]);
    };

    const handleDelete = () => {
        Alert.alert(
            "Hapus Komponen",
            `Yakin ingin menghapus "${component.name}"?`,
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: () => {
                        // TODO: delete from database
                        router.replace("/dashboard");
                    },
                },
            ],
        );
    };

    const handleLifespanChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, "");
        setLifespan(cleaned);
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
                <Text style={styles.title}>Edit {component.name}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Komponen</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nama Komponen</Text>
                        <Text style={styles.infoValue}>{component.name}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Terakhir Diganti</Text>
                        <Text style={styles.infoValue}>
                            {formatNumber(component.installKm ?? 0)} KM
                        </Text>
                    </View>
                </View>

                {/* Edit Lifespan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Interval Penggantian
                    </Text>

                    <View style={styles.inputBlock}>
                        <Text style={styles.inputLabel}>GANTI SETIAP (KM)</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                keyboardType="number-pad"
                                style={styles.input}
                                value={lifespan}
                                onChangeText={handleLifespanChange}
                                placeholder="0"
                                placeholderTextColor={COLORS.textSecondary}
                            />
                            <Text style={styles.inputUnit}>KM</Text>
                        </View>
                    </View>

                    <View style={styles.previewCard}>
                        <View style={styles.previewRow}>
                            <Text style={styles.previewLabel}>
                                Target Berikutnya
                            </Text>
                            <Text
                                style={[
                                    styles.previewValue,
                                    { color: COLORS.success },
                                ]}
                            >
                                {formatNumber(targetKm)} KM
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Delete Button */}
                <Animated.View
                    style={{
                        transform: [{ scale: deleteButtonScale }],
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        onPressIn={() => animateButton(deleteButtonScale, 0.95)}
                        onPressOut={() => animateButton(deleteButtonScale, 1)}
                    >
                        <View style={styles.deleteRow}>
                            <Trash2
                                size={18}
                                color={COLORS.error}
                                strokeWidth={2.4}
                            />
                            <Text style={styles.deleteButtonText}>
                                Hapus Komponen
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>

            {/* Save Button */}
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
                    <Text style={styles.saveButtonText}>SIMPAN</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
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
        fontSize: 20,
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

    // Section
    section: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 20,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        gap: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    divider: {
        height: 2,
        backgroundColor: COLORS.border,
    },

    // Input
    inputBlock: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textPrimary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    inputWrapper: {
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        paddingVertical: 16,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    input: {
        fontSize: 28,
        fontWeight: "700",
        color: COLORS.textPrimary,
        flex: 1,
    },
    inputUnit: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textSecondary,
    },

    // Preview
    previewCard: {
        backgroundColor: COLORS.background,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 14,
    },
    previewRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    previewLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    previewValue: {
        fontSize: 16,
        fontWeight: "800",
    },

    // Delete Button
    deleteButton: {
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.error,
        paddingVertical: 16,
        alignItems: "center",
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    deleteRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.error,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },

    // Save Button
    saveButton: {
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
        marginBottom: 20,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.textPrimary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});
