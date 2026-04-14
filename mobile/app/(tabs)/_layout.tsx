import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RED = "#E50914";
const BG = "#0a0a0a";
const SURFACE = "#111111";

function CELogo() {
  return (
    <View style={styles.logo}>
      <Text style={styles.logoText}>CE</Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 50 + (Platform.OS === "web" ? 34 : insets.bottom);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: BG, shadowColor: "transparent", borderBottomWidth: 0 },
        headerTintColor: "#fff",
        headerTitleStyle: { fontFamily: "Inter_700Bold", fontSize: 18 },
        headerLeft: () => <CELogo />,
        tabBarStyle: {
          backgroundColor: SURFACE,
          borderTopColor: "#1f1f1f",
          height: tabBarHeight,
          paddingBottom: Platform.OS === "web" ? 8 : insets.bottom,
        },
        tabBarActiveTintColor: RED,
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: { fontFamily: "Inter_500Medium", fontSize: 11, marginTop: -2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          headerTitle: "Courtney Movies",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
          headerTitle: "Search",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginLeft: 16,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
