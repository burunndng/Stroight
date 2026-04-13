import { View, StyleSheet, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const isWeb = Platform.OS === "web";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Ionicons name="flash-outline" size={38} color="#8CC8FF" />
          <Text style={styles.title}>Lumina Backend-Free Mode</Text>
          <Text style={styles.body}>
            APK generation now runs fully offline without backend or MongoDB dependency.
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Torch strobe is packaged in APK build flow</Text>
          </View>

          <Text style={styles.pathLabel}>APK artifact path</Text>
          <Text style={styles.pathText}>
            /app/_uploaded_src/lumina/android/app/build/outputs/apk/debug/app-debug.apk
          </Text>

          {isWeb && (
            <Text style={styles.webNote}>
              Web preview now shows status only. Use generated APK on Android device.
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#06080C",
  },
  container: {
    flex: 1,
    backgroundColor: "#06080C",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "88%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1D293D",
    backgroundColor: "#0B1220",
    padding: 22,
    gap: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  body: {
    color: "#BFC7D5",
    fontSize: 15,
    lineHeight: 22,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#21486E",
    backgroundColor: "#102239",
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#97D3FF",
    fontSize: 12,
    fontWeight: "600",
  },
  pathLabel: {
    color: "#8C98AB",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  pathText: {
    color: "#D8E2F0",
    fontSize: 14,
    lineHeight: 20,
  },
  webNote: {
    marginTop: 6,
    color: "#F8C170",
    fontSize: 13,
    lineHeight: 18,
  },
});
