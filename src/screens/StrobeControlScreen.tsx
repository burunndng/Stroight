import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import StrobeService from '../services/StrobeService';

const { width, height } = Dimensions.get('window');

interface Props {
  onExit: () => void;
  initialHz?: number;
}

export default function StrobeControlScreen({ onExit, initialHz = 10 }: Props) {
  const [hz, setHz] = useState(initialHz);
  const [isActive, setIsActive] = useState(false);
  const [lightOn, setLightOn] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setLightOn(false);
      StrobeService.stopStrobe();
      return;
    }

    StrobeService.startStrobe(hz, () => {
      setLightOn(prev => !prev);
    });

    return () => StrobeService.stopStrobe();
  }, [isActive, hz]);

  const handlePressIn = () => setIsActive(true);
  const handlePressOut = () => setIsActive(false);

  return (
    <View style={[styles.container, { backgroundColor: lightOn ? '#fff' : '#000' }]}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.killSwitch} onPress={onExit}>
          <Text style={styles.killText}>🛑 KILL SWITCH</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <Text style={[styles.freqDisplay, { color: lightOn ? '#000' : '#00f3ff' }]}>
          {hz.toFixed(1)} Hz
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={3}
          maximumValue={30}
          step={0.1}
          value={hz}
          onValueChange={setHz}
          minimumTrackTintColor="#00f3ff"
          thumbTintColor="#00f3ff"
        />

        <TouchableOpacity
          style={[styles.deadManButton, isActive && styles.activeButton]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'ENTRAINING...' : 'HOLD TO ACTIVATE'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  killSwitch: { backgroundColor: 'rgba(255, 45, 85, 0.8)', padding: 15, borderRadius: 30 },
  killText: { color: '#fff', fontWeight: 'bold' },
  controls: { width: '80%', alignItems: 'center' },
  freqDisplay: { fontSize: 48, fontWeight: 'bold', marginBottom: 30 },
  slider: { width: '100%', height: 40, marginBottom: 50 },
  deadManButton: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 4,
    borderColor: '#00f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 243, 255, 0.1)',
  },
  activeButton: { backgroundColor: 'rgba(0, 243, 255, 0.3)', transform: [{ scale: 0.95 }] },
  buttonText: { color: '#00f3ff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
});
