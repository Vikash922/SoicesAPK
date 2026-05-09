import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { MotiView } from 'moti';

export default function EditProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const { user } = useAuthStore();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatar_url || '');
      setTempAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    try {
      // 1. Update Profile in database
      await updateProfile.mutateAsync({
        full_name: fullName,
        phone: phone,
        avatar_url: avatarUrl,
      });

      // 2. Optional: Update Auth Phone (only if changed and valid E.164)
      // This is often tricky and triggers OTP. We'll handle it gracefully.
      if (phone && phone !== user?.phone && phone.startsWith('+')) {
        try {
          const { error: authError } = await supabase.auth.updateUser({ phone });
          if (authError) {
            console.warn('Auth phone update failed:', authError.message);
            // We don't throw here to allow the profile update to be considered successful
            Alert.alert('Profile Saved', 'Profile details updated, but phone number verification failed: ' + authError.message);
          } else {
            Alert.alert('Success', 'Profile updated. A verification code was sent to your new phone number.');
          }
        } catch (err) {
          console.warn('Auth phone update error:', err);
        }
      } else {
        Alert.alert('Success', 'Profile updated successfully');
      }
      
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200', // Turmeric
    'https://images.unsplash.com/photo-1599307767316-776533da941c?q=80&w=200', // Chili
    'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=200', // Star Anise
    'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=200', // Cinnamon
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200', // Default person
  ];

  const pickImage = () => {
    setTempAvatarUrl(avatarUrl);
    setShowAvatarModal(true);
  };

  const confirmAvatar = (url?: string) => {
    setAvatarUrl(url || tempAvatarUrl);
    setShowAvatarModal(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Edit Profile', headerShadowVisible: false }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.cardamom + '22' }]}>
                <Ionicons name="person" size={50} color={colors.cardamom} />
              </View>
            )}
            <View style={[styles.editIcon, { backgroundColor: colors.saffron }]}>
              <Ionicons name="camera" size={18} color="#000" />
            </View>
          </TouchableOpacity>
          <Text variant="caption" style={{ marginTop: 12, opacity: 0.6 }}>Tap to change avatar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text variant="overline" style={styles.label}>FULL NAME</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your name"
              placeholderTextColor={colors.tabIconDefault}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text variant="overline" style={styles.label}>EMAIL (READ-ONLY)</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, opacity: 0.5 }]}
              value={user?.email}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text variant="overline" style={styles.label}>PHONE NUMBER (WITH COUNTRY CODE)</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. +919876543210"
              placeholderTextColor={colors.tabIconDefault}
              keyboardType="phone-pad"
            />
          </View>

          <Button 
            title="SAVE CHANGES" 
            onPress={handleSave} 
            loading={updateProfile.isPending}
            style={styles.saveBtn}
          />
        </View>
      </ScrollView>

      {/* Basic Avatar URL Modal for Android compatibility */}
      {showAvatarModal && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20, zIndex: 100 }]}>
          <View style={{ backgroundColor: colors.background, padding: 24, borderRadius: 24 }}>
            <Text variant="h2" style={{ marginBottom: 8 }}>Choose Avatar</Text>
            <Text variant="caption" style={{ marginBottom: 20, opacity: 0.6 }}>Select a preset or enter a URL</Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
              {PRESET_AVATARS.map((url, index) => (
                <TouchableOpacity key={index} onPress={() => confirmAvatar(url)}>
                  <Image source={{ uri: url }} style={{ width: 60, height: 60, borderRadius: 30, borderWidth: avatarUrl === url ? 3 : 0, borderColor: colors.saffron }} />
                </TouchableOpacity>
              ))}
            </View>

            <Text variant="overline" style={{ marginBottom: 8, opacity: 0.6 }}>OR PASTE IMAGE URL</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, marginBottom: 24 }]}
              value={tempAvatarUrl}
              onChangeText={setTempAvatarUrl}
              placeholder="https://..."
              autoCapitalize="none"
            />
            
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 20 }}>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
                <Text style={{ color: colors.tabIconDefault, fontWeight: '600' }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmAvatar()}>
                <Text style={{ color: colors.saffron, fontWeight: 'bold' }}>USE URL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, alignItems: 'center' },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { width: 120, height: 120, borderRadius: 60, position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { marginBottom: 8, opacity: 0.6, fontSize: 10 },
  input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  saveBtn: { marginTop: 20 },
});
