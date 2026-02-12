import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../config/theme';

interface ToggleProps {
  label: string;
  options: [string, string];
  value: number; // 0 or 127
  onValueChange: (value: number) => void;
}

export function Toggle({ label, options, value, onValueChange }: ToggleProps) {
  const isOn = value >= 64;

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, isOn ? styles.buttonOn : styles.buttonOff]}
        onPress={() => onValueChange(isOn ? 0 : 127)}
      >
        <Text style={[styles.buttonText, isOn && styles.buttonTextOn]}>
          {isOn ? options[1] : options[0]}
        </Text>
      </Pressable>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  button: {
    width: 56,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonOff: {
    backgroundColor: colors.toggleOff,
    borderColor: colors.border,
  },
  buttonOn: {
    backgroundColor: colors.toggleOn,
    borderColor: colors.accent,
  },
  buttonText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  buttonTextOn: {
    color: colors.bg,
  },
  label: {
    color: colors.textDim,
    fontSize: 9,
    textAlign: 'center',
  },
});
