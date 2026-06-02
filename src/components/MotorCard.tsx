import { View, Text, Image, StyleSheet } from "react-native";
import { Motor } from "../types";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";

interface MotorCardProps {
    motor: Motor;
    onPress?: () => void;
}

export default function MotorCard({ motor, onPress }: MotorCardProps) {
    const getFuelTypeLabel = (fuelType: string) => {
        return fuelType === "bensin" ? "Bensin" : "Listrik";
    };

    const getTransmissionLabel = (transmission: string | null) => {
        if (!transmission) return "";
        return transmission === "manual" ? "Manual" : "Matic";
    };

    return (
        <View
            style={[
                styles.card,
                {
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.surface,
                },
            ]}
        >
            {motor.photoUri && (
                <Image
                    source={{ uri: motor.photoUri }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            <View style={styles.content}>
                <Text style={styles.motorName}>{motor.name}</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>
                        {getFuelTypeLabel(motor.fuelType)}
                        {motor.transmission &&
                            ` • ${getTransmissionLabel(motor.transmission)}`}
                    </Text>
                </View>

                <View style={styles.kmContainer}>
                    <Text style={styles.kmLabel}>Kilometer saat ini:</Text>
                    <Text style={styles.kmValue}>
                        {motor.currentKm.toLocaleString("id-ID")} km
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: BORDER_WIDTH.thick,
        shadowColor: COLORS.border,
        shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
        marginBottom: 16,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 150,
        borderBottomWidth: BORDER_WIDTH.thin,
        borderBottomColor: COLORS.border,
    },
    content: {
        padding: 16,
    },
    motorName: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    kmContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    kmLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    kmValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
});
