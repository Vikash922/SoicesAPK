import React from 'react';
import { StyleSheet, RefreshControl, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface SpicePullToRefreshProps {
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  children: React.ReactNode;
}

export function SpicePullToRefresh({ onRefresh, isRefreshing, children }: SpicePullToRefreshProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // In a real implementation with Lottie, this would track scroll offset to play animation.
  // For now, using the native RefreshControl with custom colors.
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.saffron}
          colors={[colors.saffron, colors.chili]}
          progressBackgroundColor={colors.card}
        />
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});