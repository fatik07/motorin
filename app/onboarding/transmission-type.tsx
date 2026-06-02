import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { COLORS, BORDER_WIDTH } from "@constants/theme";
import {
    LogoHeader,
    StepProgressBar,
    StepFooter,
    SelectionCard,
} from "@components/index";

export default function TransmissionTypeScreen() {
    const router = useRouter();
    const { fuel } = useLocalSearchParams<{ fuel?: string }>();
    const [selectedTransmission, setSelectedTransmission] = useState<
        "manual" | "matic" | null
    >(null);

    const handleNext = () => {
        if (selectedTransmission) {
            // TODO: Save to state/context
            router.push(`/onboarding/odometer?fuel=${fuel ?? "bensin"}`);
        }
    };

    return (
        <View style={styles.container}>
            <LogoHeader />

            <StepProgressBar currentStep={3} totalSteps={4} />

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Tipe Transmisi</Text>
                <Text style={styles.subtitle}>
                    Pilih sistem transmisi sepeda motor Anda. Informasi ini
                    membantu kami menyusun jadwal perawatan yang sesuai untuk
                    Anda.
                </Text>

                {/* Transmission Options */}
                <View style={styles.optionsContainer}>
                    <SelectionCard
                        title="Manual"
                        description="Transmisi manual dengan kopling"
                        icon={
                            <Settings
                                size={32}
                                color={COLORS.textPrimary}
                                strokeWidth={2}
                            />
                        }
                        iconBgColor="#6dfe9c"
                        selected={selectedTransmission === "manual"}
                        onPress={() => setSelectedTransmission("manual")}
                    />

                    <SelectionCard
                        title="Matic"
                        description="Transmisi otomatis tanpa kopling"
                        icon={
                            <Settings
                                size={32}
                                color={COLORS.textPrimary}
                                strokeWidth={2}
                            />
                        }
                        iconBgColor="#fef08a"
                        selected={selectedTransmission === "matic"}
                        onPress={() => setSelectedTransmission("matic")}
                    />
                </View>
            </View>

            <StepFooter
                onBack={() => router.back()}
                onNext={handleNext}
                nextDisabled={!selectedTransmission}
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
    optionsContainer: {
        marginBottom: 24,
    },
    infoBox: {
        flexDirection: "row",
        backgroundColor: "#fffbeb",
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        padding: 16,
        gap: 12,
        alignItems: "center",
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        fontWeight: "500",
        color: "#92400e",
        lineHeight: 20,
    },
});
