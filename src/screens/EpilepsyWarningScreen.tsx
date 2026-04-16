import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
  onAccept: () => void;
}

export default function EpilepsyWarningScreen({ onAccept }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [secondsLeft]);

  return (
    <View style={styles.container}>
      <View style={styles.warningBox}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>PHOTOSENSITIVE EPILEPSY WARNING</Text>
        <Text style={styles.text}>
          This application uses strobe lights which may trigger seizures in people with photosensitive epilepsy.
        </Text>
        <Text style={styles.text}>
          Do not use if you have a history of seizures, migraines, or heart conditions.
        </Text>

        <View style={styles.timerBox}>
          <Text style={styles.timerText}>Wait {secondsLeft}s</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, secondsLeft > 0 && styles.disabledButton]}
          onPress={onAccept}
          disabled={secondsLeft > 0}
        >
          <Text style={styles.buttonText}>I UNDERSTAND THE RISKS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 20 },
  warningBox: { borderWidth: 2, borderColor: '#FF2D55', padding: 20, borderRadius: 10 },
  icon: { fontSize: 50, textAlign: 'center', marginBottom: 20 },
  title: { color: '#FF2D55', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  text: { color: '#fff', fontSize: 16, marginBottom: 15, lineHeight: 24 },
  timerBox: { backgroundColor: '#333', padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 20 },
  timerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  button: { backgroundColor: '#FF2D55', padding: 15, borderRadius: 5, alignItems: 'center' },
  disabledButton: { backgroundColor: '#555' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
