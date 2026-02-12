import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../config/theme';

interface SelectorProps {
  label: string;
  options: string[];
  value: number; // 0-127, divided evenly among options
  onValueChange: (value: number) => void;
}

export function Selector({
  label,
  options,
  value,
  onValueChange,
}: SelectorProps) {
  const step = options.length > 1 ? 127 / (options.length - 1) : 0;
  const activeIndex = step > 0 ? Math.round(value / step) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.options}>
        {options.map((opt, i) => {
          const isActive = i === activeIndex;
          return (
            <Pressable
              key={opt}
              style={[
                styles.option,
                isActive ? styles.optionActive : styles.optionInactive,
              ]}
              onPress={() => onValueChange(Math.round(i * step))}
            >
              <Text
                style={[
                  styles.optionText,
                  isActive && styles.optionTextActive,
                ]}
              >
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  options: {
    flexDirection: 'column',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 56,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: colors.selectorActive,
  },
  optionInactive: {
    backgroundColor: colors.selectorInactive,
  },
  optionText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '500',
  },
  optionTextActive: {
    color: colors.bg,
    fontWeight: '700',
  },
  label: {
    color: colors.textDim,
    fontSize: 9,
    textAlign: 'center',
  },
});
