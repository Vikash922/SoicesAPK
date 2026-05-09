import React, { useEffect, useState } from 'react';
import { Modal, PermissionsAndroid, Platform, Pressable, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Themed';

const PERMISSION_KEY = 'spicecart.permissions.v1';

export function PermissionOnboardingModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PERMISSION_KEY).then((value) => {
      if (!value) setVisible(true);
    });
  }, []);

  const requestAllPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);
    }

    await AsyncStorage.setItem(PERMISSION_KEY, 'done');
    setVisible(false);
  };

  const skipForNow = async () => {
    await AsyncStorage.setItem(PERMISSION_KEY, 'done');
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Enable Smart Permissions</Text>
          <Text style={styles.subtitle}>
            Allow Location for nearby delivery, Storage for product photos, and Microphone for voice search.
          </Text>

          <View style={styles.row}>
            <Ionicons name="location" size={20} color="#E8590C" />
            <Text style={styles.item}>Location for faster delivery estimates</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="images" size={20} color="#2E8B57" />
            <Text style={styles.item}>Storage access for receipts and uploads</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="mic" size={20} color="#C41E3A" />
            <Text style={styles.item}>Microphone for voice search</Text>
          </View>

          <Pressable onPress={requestAllPermissions} style={styles.primary}>
            <Text style={styles.primaryText}>Allow & Continue</Text>
          </Pressable>
          <Pressable onPress={skipForNow} style={styles.secondary}>
            <Text style={styles.secondaryText}>Maybe later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFF8E7', borderRadius: 18, padding: 18 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#1A1A2E', opacity: 0.8, marginBottom: 14, lineHeight: 21 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  item: { fontSize: 13, color: '#1A1A2E', flex: 1 },
  primary: { backgroundColor: '#E2B714', paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  primaryText: { textAlign: 'center', fontSize: 15, fontWeight: '700', color: '#111' },
  secondary: { paddingVertical: 12, borderRadius: 10, marginTop: 6 },
  secondaryText: { textAlign: 'center', fontSize: 14, color: '#8B4513', fontWeight: '600' },
});
