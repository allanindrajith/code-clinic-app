import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Image } from 'expo-image';

interface MascotIconProps {
  size?: number;
  color?: string;
}

export function MascotIcon({ size = 40, color = '#000000' }: MascotIconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          width={size}
          height={size}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }}
        >
          {/* Ear Tufts / Feather Horns */}
          <path d="M34 26 L26 12 C29 20 36 24 40 25" />
          <path d="M86 26 L94 12 C91 20 84 24 80 25" />

          {/* Head Crown Contour */}
          <path d="M38 25 C44 21 76 21 82 25" />

          {/* Doctor Head Mirror (Reflector) on Forehead */}
          <circle cx="60" cy="21" r="4.5" fill="#ffffff" stroke={color} strokeWidth="2" />
          <circle cx="60" cy="21" r="1.5" fill={color} stroke="none" />
          <path d="M48 23 Q60 21 72 23" strokeDasharray="2 2" strokeWidth="1.5" />

          {/* Owl Facial Discs & Big Round Eyes / Doctor Glasses */}
          <circle cx="45" cy="42" r="13" fill="#ffffff" stroke={color} strokeWidth="2.5" />
          <circle cx="46" cy="42" r="4" fill={color} stroke="none" />
          <circle cx="48" cy="40" r="1.5" fill="#ffffff" stroke="none" />

          <circle cx="75" cy="42" r="13" fill="#ffffff" stroke={color} strokeWidth="2.5" />
          <circle cx="74" cy="42" r="4" fill={color} stroke="none" />
          <circle cx="76" cy="40" r="1.5" fill="#ffffff" stroke="none" />

          {/* Spectacle Bridge connecting the eyes */}
          <path d="M58 42 Q60 39 62 42" strokeWidth="2.5" />

          {/* Small Curved Beak */}
          <path d="M57 47 L60 55 L63 47 Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />

          {/* Outer Head & Body Contour */}
          <path d="M28 36 C24 48 24 64 26 80 C28 94 36 104 60 104 C84 104 92 94 94 80 C96 64 96 48 92 36" />

          {/* Folded Wings */}
          <path d="M27 60 C32 68 36 78 35 90" strokeWidth="2.2" />
          <path d="M93 60 C88 68 84 78 85 90" strokeWidth="2.2" />

          {/* Chest Plumage lines (Doctor coat vest vibe) */}
          <path d="M48 64 Q52 68 56 64" strokeWidth="1.8" />
          <path d="M64 64 Q68 68 72 64" strokeWidth="1.8" />
          <path d="M54 72 Q60 76 66 72" strokeWidth="1.8" />

          {/* Doctor Stethoscope draping around neck */}
          <path d="M38 58 Q46 72 60 72 Q74 72 82 58" strokeWidth="2.6" />
          <path d="M60 72 L60 84" strokeWidth="2.2" />
          <circle cx="60" cy="88" r="4.5" fill="#ffffff" stroke={color} strokeWidth="2.2" />
          <circle cx="60" cy="88" r="1.5" fill={color} stroke="none" />

          {/* Small Owl Feet / Talons perching */}
          <path d="M46 104 L46 109 M42 108 L46 104 M50 108 L46 104" strokeWidth="2" />
          <path d="M74 104 L74 109 M70 108 L74 104 M78 108 L74 104" strokeWidth="2" />
        </svg>
      </View>
    );
  }

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
