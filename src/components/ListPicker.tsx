import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../config/theme';

interface ListPickerProps {
  label: string;
  items: string[];
  value: number; // 0-127, maps to item index
  onValueChange: (value: number) => void;
}

export function ListPicker({
  label,
  items,
  value,
  onValueChange,
}: ListPickerProps) {
  const selectedIndex = Math.min(value, items.length - 1);

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={items}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <Pressable
              style={[
                styles.item,
                index === selectedIndex && styles.itemSelected,
              ]}
              onPress={() => onValueChange(index)}
            >
              <Text
                style={[
                  styles.itemText,
                  index === selectedIndex && styles.itemTextSelected,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
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
  listContainer: {
    width: 72,
    height: 120,
    backgroundColor: colors.faderTrack,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  item: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  itemSelected: {
    backgroundColor: colors.selectorActive,
  },
  itemText: {
    color: colors.text,
    fontSize: 10,
  },
  itemTextSelected: {
    color: colors.bg,
    fontWeight: '700',
  },
  label: {
    color: colors.textDim,
    fontSize: 9,
    textAlign: 'center',
  },
});
