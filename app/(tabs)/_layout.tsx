import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useCartStore } from '@/store/useCartStore';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const itemCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.qty, 0));

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        headerShown: false,
        tabBarBackground: () => (
          <BlurView 
            intensity={isDark ? 40 : 80} 
            tint={isDark ? 'dark' : 'default'} 
            style={StyleSheet.absoluteFill} 
          />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <TabBarIcon name="search-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <TabBarIcon name="cart-outline" color={color} />,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: { 
            backgroundColor: Colors[colorScheme].saffron, 
            color: '#000',
            fontSize: 10,
            lineHeight: 14,
          }
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
