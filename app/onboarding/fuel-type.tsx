import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Fuel, Zap } from "lucide-react-native";
import { COLORS } from "@constants/theme";
import {
    LogoHeader,
    StepProgressBar,
    StepFooter,
    SelectionCard,
} from "@components/index";

export default function FuelTypeScreen() {
    const router = useRouter();
    const [selectedFuel, setSelectedFuel] = useState<
        "bensin" | "listrik" | null
    >(null);

    const handleNext = () => {
        if (selectedFuel) {
            // TODO: Save to state/context
            if (selectedFuel === "listrik") {
                router.push("/onboarding/odometer?fuel=listrik");
                return;
            }

            router.push("/onboarding/transmission-type?fuel=bensin");
        }
    };

    return (
        <View style={styles.container}>
            <LogoHeader />

            <StepProgressBar currentStep={2} totalSteps={4} />

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Jenis Bahan Bakar</Text>
                <Text style={styles.subtitle}>
                    Pilih jenis bahan bakar sepeda motor Anda. Hal ini membantu
                    kami memberikan pengingat dan pelacakan perawatan yang
                    akurat.
                </Text>

                {/* Fuel Options */}
                <View style={styles.optionsContainer}>
                    <SelectionCard
                        title="Bensin"
                        description="Motor berbahan bakar bensin konvensional"
                        icon={
                            <Fuel
                                size={32}
                                color={COLORS.textPrimary}
                                strokeWidth={2}
                            />
                        }
                        iconBgColor="#fef08a" // COLORS.primary roughly
                        selected={selectedFuel === "bensin"}
                        onPress={() => setSelectedFuel("bensin")}
                    />

                    <SelectionCard
                        title="Listrik"
                        description="Motor listrik ramah lingkungan"
                        icon={
                            <Zap
                                size={32}
                                color={COLORS.textPrimary}
                                strokeWidth={2}
                                fill={COLORS.textPrimary}
                            />
                        }
                        iconBgColor="#6dfe9c"
                        selected={selectedFuel === "listrik"}
                        onPress={() => setSelectedFuel("listrik")}
                    />
                </View>
            </View>

            <StepFooter
                onBack={() => router.back()}
                onNext={handleNext}
                nextDisabled={!selectedFuel}
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
        gap: 0,
        marginBottom: 24,
    },
});
