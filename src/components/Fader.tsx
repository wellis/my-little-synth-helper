import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
  interpolate,
  clamp,
} from 'react-native-reanimated';
import { colors, layout } from '../config/theme';

interface FaderProps {
  label: string;
  value: number; // 0-127
  onValueChange: (value: number) => void;
  width?: number;
  height?: number;
}

const THUMB_HEIGHT = 24;

export function Fader({
  label,
  value,
  onValueChange,
  width = layout.faderWidth,
  height = layout.faderHeight,
}: FaderProps) {
  const trackHeight = height - THUMB_HEIGHT;
  const position = useSharedValue(((127 - value) / 127) * trackHeight);
  const startPosition = useSharedValue(0);

  useEffect(() => {
    position.value = withTiming(((127 - value) / 127) * trackHeight, {
      duration: 50,
    });
  }, [value, trackHeight]);

  const emitValue = useCallback(
    (pos: number) => {
      const midiVal = Math.round(
        interpolate(pos, [0, trackHeight], [127, 0])
      );
      onValueChange(clamp(midiVal, 0, 127));
    },
    [trackHeight, onValueChange]
  );

  const gesture = Gesture.Pan()
    .onStart(() => {
      startPosition.value = position.value;
    })
    .onUpdate((e) => {
      const newPos = clamp(
        startPosition.value + e.translationY,
        0,
        trackHeight
      );
      position.value = newPos;
      runOnJS(emitValue)(newPos);
    })
    .minDistance(0);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: position.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    height: trackHeight - position.value,
    bottom: 0,
  }));

  return (
    <View style={[styles.container, { width }]}>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <GestureDetector gesture={gesture}>
        <View style={[styles.track, { height, width: width - 8 }]}>
          <Animated.View
            style={[styles.fill, fillStyle, { width: width - 12 }]}
          />
          <Animated.View
            style={[thumbStyle, styles.thumb, { width: width - 8 }]}
          />
        </View>
      </GestureDetector>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  track: {
    backgroundColor: colors.faderTrack,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    backgroundColor: colors.faderFill,
    opacity: 0.3,
    borderRadius: 4,
    left: 2,
  },
  thumb: {
    height: THUMB_HEIGHT,
    backgroundColor: colors.faderThumb,
    borderRadius: 4,
    position: 'absolute',
    left: 0,
  },
  value: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  label: {
    color: colors.textDim,
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
  },
});
