import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SpiceProductCard } from '@/components/spice/SpiceProductCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useWishlistStore } from '@/store/useWishlistStore';

export default function WishlistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const { items, toggleItem, isInWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.emptyIconContainer, { backgroundColor: colors.chili + '11' }]}>
          <Ionicons name="heart-outline" size={60} color={colors.chili} />
        </View>
        <Text variant="h2" family="heading" style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Text variant="body2" style={styles.emptySubtitle}>
          Save items you love to find them easily later and get notified of price drops!
        </Text>
        <Button title="DISCOVER SPICES" onPress={() => router.replace('/(tabs)/explore')} style={styles.discoverBtn} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text variant="h1" family="heading">Wishlist</Text>
        <Text variant="caption" style={{ opacity: 0.6 }}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        numColumns={2}
        renderItem={({ item, index }) => (
          <View style={styles.gridItem}>
            <SpiceProductCard 
              id={item.id}
              name={item.name}
              image={item.image}
              price={item.price}
              rating={item.rating}
              index={index}
              isWishlisted={true}
              onToggleWishlist={() => toggleItem(item)}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          </View>
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
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline' 
  },
  listContent: { paddingHorizontal: 10, paddingBottom: 100 },
  gridItem: { width: '50%', padding: 5 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIconContainer: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  emptyTitle: { marginBottom: 10 },
  emptySubtitle: { textAlign: 'center', opacity: 0.6, lineHeight: 22, marginBottom: 30 },
  discoverBtn: { width: '100%' },
});
