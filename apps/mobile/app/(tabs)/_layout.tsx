import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

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
  const itemCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.qty, 0));

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        headerShown: false, // We'll use custom headers in screens
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'light' ? '#eee' : '#333',
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
          tabBarBadgeStyle: { backgroundColor: Colors[colorScheme].saffron, color: '#000' }
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
