import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import EpilepsyWarningScreen from './src/screens/EpilepsyWarningScreen';
import StrobeControlScreen from './src/screens/StrobeControlScreen';
import { PRESETS } from './src/types';

export default function App() {
  const [hasAcceptedWarning, setHasAcceptedWarning] = useState(false);
  const [activePreset, setActivePreset] = useState<typeof PRESETS[0] | null>(null);

  if (!hasAcceptedWarning) {
    return (
      <>
        <EpilepsyWarningScreen onAccept={() => setHasAcceptedWarning(true)} />
        <StatusBar style="light" />
      </>
    );
  }

  if (activePreset) {
    return (
      <>
        <StrobeControlScreen
          initialHz={activePreset.frequency}
          onExit={() => setActivePreset(null)}
        />
        <StatusBar style={activePreset.id === 'chaos' ? 'light' : 'light'} />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEURO-STROBE</Text>
      <Text style={styles.subtitle}>Select a Journey</Text>

      {PRESETS.map((preset) => (
        <TouchableOpacity
          key={preset.id}
          style={[styles.card, { borderColor: preset.color }]}
          onPress={() => setActivePreset(preset)}
        >
          <Text style={[styles.cardTitle, { color: preset.color }]}>{preset.name}</Text>
          <Text style={styles.cardDesc}>{preset.description}</Text>
          <Text style={styles.cardMeta}>{preset.frequency} Hz • {preset.mode.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', padding: 20, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#00f3ff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#888', textAlign: 'center', marginBottom: 30 },
  card: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  cardDesc: { color: '#ccc', marginBottom: 10 },
  cardMeta: { color: '#666', fontSize: 12, textTransform: 'uppercase' },
});
