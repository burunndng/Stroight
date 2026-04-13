import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const luminaUrl = useMemo(() => {
    if (!EXPO_PUBLIC_BACKEND_URL) return "";
    return `${EXPO_PUBLIC_BACKEND_URL.replace(/\/$/, "")}/api/lumina/`;
  }, []);

  useEffect(() => {
    if (Platform.OS === "web" && luminaUrl) {
      globalThis.location?.replace(luminaUrl);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, [luminaUrl]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#3AA6FF" />
            <Text style={styles.loadingText}>Loading Lumina…</Text>
          </View>
        )}

        {Platform.OS === "web" ? (
          <View style={styles.errorWrap}>
            <Text style={styles.loadingText}>Opening Lumina preview…</Text>
          </View>
        ) : error ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorTitle}>Preview issue</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <WebView
            source={{ uri: luminaUrl }}
            style={styles.webview}
            onLoadEnd={() => setLoading(false)}
            onError={(e) => {
              setLoading(false);
              setError(e.nativeEvent.description || "Unable to load Lumina.");
            }}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
          />
        )}
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
  },
  webview: {
    flex: 1,
    backgroundColor: "#06080C",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    backgroundColor: "transparent",
    pointerEvents: "none",
    gap: 10,
  },
  loadingText: {
    color: "#9AA7BC",
    fontSize: 14,
    fontWeight: "600",
  },
  errorWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 10,
  },
  errorTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  errorText: {
    color: "#BFC7D5",
    fontSize: 14,
    textAlign: "center",
  },
});
