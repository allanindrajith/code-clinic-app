import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

interface MascotIconProps {
  size?: number;
}

export function MascotIcon({ size = 40 }: MascotIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={require('@/assets/images/mascot.svg')}
        style={{ width: size, height: size }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
