import { Tabs } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Bike, ClipboardList, Gauge, Settings } from "lucide-react-native";
import { COLORS, BORDER_WIDTH } from "@constants/theme";

function TabBarButton({ onPress, ...otherProps }: any) {
    const focused = otherProps["aria-selected"] === true;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            {...otherProps}
            style={[
                otherProps.style,
                styles.tabButton,
                focused && styles.tabButtonFocused,
            ]}
        >
            {otherProps.children}
        </TouchableOpacity>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopWidth: BORDER_WIDTH.thin,
                    borderTopColor: COLORS.border,
                    height: 76,
                    paddingBottom: 10,
                    paddingTop: 10,
                    paddingHorizontal: 10,
                },
                tabBarBackground: () => (
                    <View style={styles.tabBarBackground} />
                ),
                tabBarButton: (props) => <TabBarButton {...props} />,
                tabBarActiveTintColor: COLORS.textPrimary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: "Inter-Medium",
                    fontWeight: "700",
                    marginTop: 2,
                },
                tabBarItemStyle: {
                    borderRadius: 12,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color }) => (
                        <Gauge size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="garage"
                options={{
                    title: "Garage",
                    tabBarIcon: ({ color }) => <Bike size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color }) => (
                        <ClipboardList size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => (
                        <Settings size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarBackground: {
        flex: 1,
        borderTopWidth: BORDER_WIDTH.thin,
        borderTopColor: COLORS.border,
    },
    tabButton: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 8,
        transform: [{ translateY: 0 }],
    },
    tabButtonFocused: {
        backgroundColor: COLORS.primary,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: COLORS.border,
        transform: [{ translateY: -2 }],
    },
});
