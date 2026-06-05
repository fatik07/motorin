import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    TextInput,
    Image,
    Alert,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { ArrowLeft, Camera, ShieldCheck } from "lucide-react-native";
import { COLORS, BORDER_WIDTH, SHADOW_OFFSET } from "@constants/theme";

export default function EditProfileScreen() {
    const router = useRouter();
    const backButtonScale = useRef(new Animated.Value(1)).current;
    const saveButtonScale = useRef(new Animated.Value(1)).current;

    const [name, setName] = useState("Fatik");
    const [email, setEmail] = useState("fatik@gmail.com");
    const [phone, setPhone] = useState("81234567890");

    const animateButton = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const handleSave = () => {
        Alert.alert(
            "Berhasil",
            "Profil Anda telah berhasil diperbarui.",
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
        <View style={styles.container}>
            {/* Header */}
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
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Picture Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{
                                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDic8UupYTsXJubDo3RUy8BTzJZzR3LeGuMG6pLJ1QJhTKWq_LSOp6KThE3reNmB0zVZYVDDvBAZMP5WoUL8e-AUiUjwwKCEu2lWOoVkFTDPgNMIkj3ovF4sEQf3ZX9guo5nru2JsY2jsOWlFu0RIg0l_S-kFUv-PEZSDxQw_S4MqiEsqgzib3mdZGt2zQ8Ami6o-pOhPWDn9egs2FnGaY0yDLGj3yN3XPC1aSH_593JBoe6J7NmBcTcj37l-XG-CTV2XyADgaKsn11",
                            }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity
                            style={styles.cameraBadge}
                            activeOpacity={0.8}
                        >
                            <Camera
                                size={20}
                                color={COLORS.textPrimary}
                                strokeWidth={2.5}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Section */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Lengkap</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Masukkan nama lengkap"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Masukkan email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nomor Telepon</Text>
                        <View style={styles.inputWrapper}>
                            <View style={styles.phonePrefix}>
                                <Text style={styles.prefixText}>+62</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { paddingLeft: 0 }]}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="812xxxxxx"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Verification Tag */}
                    <View style={styles.verifyCard}>
                        <View style={styles.verifyIconBox}>
                            <ShieldCheck
                                size={24}
                                color={COLORS.success}
                                strokeWidth={2.5}
                            />
                        </View>
                        <View style={styles.verifyTextContent}>
                            <Text style={styles.verifyTitle}>
                                Identitas Terverifikasi
                            </Text>
                            <Text style={styles.verifyDesc}>
                                Data profil Anda telah terverifikasi dengan
                                nomor kendaraan B 1234 XYZ.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Area */}
            <View style={styles.footer}>
                <Animated.View
                    style={{ transform: [{ scale: saveButtonScale }] }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.saveButton}
                        onPress={handleSave}
                        onPressIn={() => animateButton(saveButtonScale, 0.95)}
                        onPressOut={() => animateButton(saveButtonScale, 1)}
                    >
                        <Text style={styles.saveButtonText}>
                            SIMPAN PERUBAHAN
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
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
    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    saveHeaderText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 120,
    },
    avatarSection: {
        alignItems: "center",
        marginBottom: 40,
    },
    avatarWrapper: {
        position: "relative",
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: COLORS.border,
    },
    cameraBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 10,
        borderRadius: 15,
        shadowColor: COLORS.border,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textPrimary,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        height: 56,
        paddingHorizontal: 16,
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    phonePrefix: {
        paddingRight: 12,
        marginRight: 12,
        borderRightWidth: 1,
        borderRightColor: "#e5e7eb",
    },
    prefixText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    verifyCard: {
        flexDirection: "row",
        backgroundColor: COLORS.secondary,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        padding: 16,
        gap: 16,
        marginTop: 8,
        shadowColor: COLORS.border,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    verifyIconBox: {
        width: 44,
        height: 44,
        backgroundColor: COLORS.surface,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    verifyTextContent: {
        flex: 1,
        gap: 4,
    },
    verifyTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    verifyDesc: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textPrimary,
        opacity: 0.7,
        lineHeight: 16,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: "rgba(245, 245, 245, 0.9)",
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thick,
        borderColor: COLORS.border,
        height: 64,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.border,
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },
});
