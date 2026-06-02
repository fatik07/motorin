import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Gauge } from "lucide-react-native";
import { COLORS } from "@constants/theme";
import {
    LogoHeader,
    StepProgressBar,
    NeoBrutalCard,
    StepFooter,
} from "@components/index";

export default function OdometerScreen() {
    const router = useRouter();
    const { fuel } = useLocalSearchParams<{ fuel?: string }>();
    const [odometer, setOdometer] = useState("");
    const isElectric = fuel === "listrik";
    const currentStep = isElectric ? 3 : 4;
    const totalSteps = isElectric ? 3 : 4;

    const handleFinish = () => {
        if (odometer.trim()) {
            // TODO: Save all data and navigate to dashboard
            router.replace("/(tabs)/dashboard");
        }
    };

    const formatNumber = (text: string) => {
        // Remove non-numeric characters
        const numeric = text.replace(/[^0-9]/g, "");
        // Format with thousand separators
        return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleOdometerChange = (text: string) => {
        const formatted = formatNumber(text);
        setOdometer(formatted);
    };

    return (
        <View style={styles.container}>
            <LogoHeader />

            <StepProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
            />

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Odometer</Text>
                <Text style={styles.subtitle}>
                    Catat kilometer saat ini untuk tracking servis dan perawatan
                    yang akurat.
                </Text>

                <NeoBrutalCard>
                    {/* Input Field */}
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>
                            KILOMETER SAAT INI
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: 15.000"
                                placeholderTextColor="#9ca3af"
                                value={odometer}
                                onChangeText={handleOdometerChange}
                                keyboardType="numeric"
                            />
                            <Gauge
                                size={24}
                                color={COLORS.textSecondary}
                                strokeWidth={2}
                            />
                        </View>
                        <Text style={styles.inputHint}>
                            Angka ini akan digunakan sebagai baseline untuk
                            reminder servis berikutnya.
                        </Text>
                    </View>
                </NeoBrutalCard>
            </View>

            <StepFooter
                onBack={() => router.back()}
                onNext={handleFinish}
                nextLabel="SELESAI"
                nextDisabled={!odometer.trim()}
                showNextIcon={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 140,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.textSecondary,
        lineHeight: 24,
        marginBottom: 32,
    },
    inputSection: {
        marginBottom: 0,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.background,
        borderWidth: 3,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    inputHint: {
        fontSize: 12,
        fontWeight: "500",
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
});
