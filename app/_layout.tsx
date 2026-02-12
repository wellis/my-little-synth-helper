import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useMidiStore } from '../src/store/useMidiStore';
import { colors } from '../src/config/theme';

export default function RootLayout() {
  const initialize = useMidiStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" hidden />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.accent,
          headerTitleStyle: { fontWeight: '700', fontSize: 14 },
          tabBarStyle: {
            backgroundColor: colors.bg,
            borderTopColor: colors.border,
            height: 44,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textDim,
          tabBarLabelStyle: { fontSize: 11 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'P-6 Granular',
            headerShown: false,
            tabBarLabel: 'P-6 Granular',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'MIDI Settings',
            tabBarLabel: 'Settings',
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
