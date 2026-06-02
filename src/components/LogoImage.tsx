import { View, Image, StyleSheet } from "react-native";

interface LogoImageProps {
    size?: "small" | "medium" | "large";
    containerStyle?: any;
}

export default function LogoImage({
    size = "medium",
    containerStyle,
}: LogoImageProps) {
    const sizeStyles = {
        small: {
            width: 150,
            aspectRatio: 16 / 9,
        },
        medium: {
            width: 300,
            aspectRatio: 16 / 9,
        },
        large: {
            width: 400,
            aspectRatio: 16 / 9,
        },
    };

    return (
        <View
            style={[
                styles.logoImageContainer,
                sizeStyles[size],
                containerStyle,
            ]}
        >
            <Image
                source={require("../../assets/motorin2.png")}
                style={styles.logoImage}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    logoImageContainer: {
        overflow: "hidden",
        alignSelf: "center",
    },
    logoImage: {
        width: "100%",
        height: "100%",
    },
});
