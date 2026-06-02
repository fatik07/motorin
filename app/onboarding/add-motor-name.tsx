import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Bike } from "lucide-react-native";
import { COLORS } from "@constants/theme";
import {
    LogoHeader,
    StepProgressBar,
    NeoBrutalCard,
    StepFooter,
} from "@components/index";

export default function AddMotorNameScreen() {
    const router = useRouter();
    const [motorName, setMotorName] = useState("");

    const handleNext = () => {
        if (motorName.trim()) {
            // TODO: Save to state/context
            router.push("/onboarding/fuel-type");
        }
    };

    return (
        <View style={styles.container}>
            <LogoHeader />

            <StepProgressBar currentStep={1} totalSteps={4} />

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Nama Motor</Text>
                <Text style={styles.subtitle}>
                    Personalisasi perjalananmu dengan nama panggilan yang unik.
                </Text>

                <NeoBrutalCard>
                    {/* Input Field */}
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>
                            NAMA PANGGILAN MOTOR
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: Si Hitam"
                                placeholderTextColor="#9ca3af"
                                value={motorName}
                                onChangeText={setMotorName}
                            />
                            <Bike
                                size={24}
                                color={COLORS.textSecondary}
                                strokeWidth={2}
                            />
                        </View>
                        <Text style={styles.inputHint}>
                            Nama ini akan muncul di dashboard utama.
                        </Text>
                    </View>
                </NeoBrutalCard>
            </View>

            <StepFooter
                onBack={() => router.back()}
                onNext={handleNext}
                nextDisabled={!motorName.trim()}
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
