import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '../Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import LottieView from 'lottie-react-native';
import { MotiView } from 'moti';

interface SpiceCouponInputProps {
  onApply: (code: string) => boolean | Promise<boolean>;
  onSuccess?: () => void;
  style?: any;
}

export function SpiceCouponInput({ onApply, onSuccess, style }: SpiceCouponInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setStatus('loading');
    
    // Simulate slight delay for validation
    setTimeout(async () => {
      const isValid = await onApply(code.toUpperCase());
      if (isValid) {
        setStatus('success');
        if (onSuccess) onSuccess();
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000); // Reset error state after 3s
      }
    }, 500);
  };

  const getBorderColor = () => {
    if (status === 'success') return colors.cardamom;
    if (status === 'error') return colors.chili;
    return 'rgba(0,0,0,0.05)';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card || '#fff', borderColor: getBorderColor() }, style]}>
      <Ionicons 
        name="pricetag-outline" 
        size={20} 
        color={status === 'success' ? colors.cardamom : colors.saffron} 
      />
      
      <TextInput 
        style={[styles.input, { color: colors.text }]}
        placeholder="Enter Coupon Code"
        placeholderTextColor={colors.tabIconDefault}
        value={code}
        onChangeText={(text) => {
          setCode(text);
          if (status !== 'idle') setStatus('idle');
        }}
        autoCapitalize="characters"
        editable={status !== 'success'}
      />
      
      {status === 'success' ? (
        <MotiView 
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          style={styles.successBadge}
        >
          <Ionicons name="checkmark-circle" size={24} color={colors.cardamom} />
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <LottieView 
              source={{ uri: 'https://raw.githubusercontent.com/spemer/lottie-animations-json/master/check_mark.json' }} 
              autoPlay 
              loop={false} 
              style={styles.confetti} 
            />
          </View>
        </MotiView>
      ) : (
        <TouchableOpacity 
          onPress={handleApply}
          disabled={!code.trim() || status === 'loading'}
          style={[
            styles.applyBtn, 
            { backgroundColor: code.trim() ? colors.saffron : colors.tabIconDefault + '33' }
          ]}
        >
          {status === 'loading' ? (
            <Ionicons name="ellipsis-horizontal" size={16} color="#000" />
          ) : (
            <Text variant="caption" family="heading" style={{ color: code.trim() ? '#000' : colors.tabIconDefault }}>APPLY</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  applyBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBadge: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confetti: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: -13,
    left: -13,
  },
});
