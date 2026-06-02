import { View, StyleSheet } from "react-native";
import LogoImage from "./LogoImage";

export default function LogoHeader() {
    return (
        <View style={styles.header}>
            <LogoImage
                size="small"
                containerStyle={{ marginBottom: -15, marginTop: -15 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        paddingTop: 60,
        paddingBottom: 20,
    },
});
