import React from 'react';
import { StyleSheet, View, FlatList, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SpiceProductCard } from '@/components/spice/SpiceProductCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import LottieView from 'lottie-react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

export default function WishlistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const { items, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (item: any) => {
    addItem({ ...item, qty: 1 });
    toggleItem(item); // Remove from wishlist
  };

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: colors.background }]}>
        <LottieView 
          source={require('@/assets/lottie/empty_jar.json')} 
          autoPlay 
          loop 
          style={styles.emptyLottie} 
        />
        <Text variant="h2" family="heading" style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Text variant="body2" style={styles.emptySubtitle}>
          Save spices you love to find them easily later and get notified of price drops!
        </Text>
        <Button title="DISCOVER SPICES" onPress={() => router.replace('/(tabs)/explore')} style={styles.discoverBtn} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text variant="h1" family="heading">Wishlist</Text>
        <View style={[styles.badgeCount, { backgroundColor: colors.saffron + '20' }]}>
          <Text variant="caption" family="heading" style={{ color: colors.saffron }}>{items.length} items</Text>
        </View>
      </View>

      <FlatList
        data={items}
        numColumns={2}
        renderItem={({ item, index }) => (
          <Animated.View 
            entering={FadeInUp.delay(index * 100)} 
            layout={Layout.springify()}
            style={styles.gridItem}
          >
            <SpiceProductCard 
              id={item.id}
              name={item.name}
              image={item.image}
              price={item.price}
              rating={item.rating || 4.5}
              index={index}
              isWishlisted={true}
              onToggleWishlist={() => toggleItem(item)}
              onAddToCart={() => handleMoveToCart(item)}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  badgeCount: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  listContent: { paddingHorizontal: 10, paddingBottom: 100 },
  gridItem: { width: '50%', padding: 5 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyLottie: { width: 250, height: 250, marginBottom: -20 },
  emptyTitle: { marginBottom: 10 },
  emptySubtitle: { textAlign: 'center', opacity: 0.6, lineHeight: 22, marginBottom: 30 },
  discoverBtn: { width: '100%' },
});
