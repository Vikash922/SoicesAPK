# SpiceCart Home Screen Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the current static Home Screen into a high-fidelity, interactive hub with 3D effects, custom physics-based refresh, and polished micro-interactions.

**Architecture:** Use `react-native-reanimated` for all animations, `expo-linear-gradient` for visual depth, and custom gesture handlers for the 3D carousel and refresh control.

**Tech Stack:** React Native, Expo, Reanimated, Lucide/Ionicons.

---

### Task 1: Create HomeHeader Component

**Files:**
- Create: `Spicesapk/components/ui/HomeHeader.tsx`
- Modify: `Spicesapk/app/(tabs)/index.tsx`

- [ ] **Step 1: Implement the sticky header with search and location**

```tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export const HomeHeader = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topRow}>
        <Text variant="h2" family="display" style={{ color: colors.saffron }}>SpiceCart</Text>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={[styles.badge, { backgroundColor: colors.chili }]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colorScheme === 'light' ? '#F5F5F5' : '#16213E' }]}>
        <Ionicons name="search-outline" size={20} color={colors.tabIconDefault} />
        <TextInput 
          placeholder="Search spices, blends, masalas..." 
          placeholderTextColor={colors.tabIconDefault}
          style={styles.searchInput}
        />
      </View>

      <TouchableOpacity style={styles.locationBar}>
        <Ionicons name="location-outline" size={16} color={colors.saffron} />
        <Text variant="caption" style={styles.locationText}>Delivering to <Text variant="caption" family="heading" style={{ color: colors.saffron }}>Mumbai, MH 400001</Text> v</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  topActions: { flexDirection: 'row' },
  iconBtn: { padding: 8 },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: 'transparent' },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 48, borderRadius: 12, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#FFF' },
  locationBar: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 4, opacity: 0.7 },
});
```

- [ ] **Step 2: Commit**

```bash
git add Spicesapk/components/ui/HomeHeader.tsx
git commit -m "feat: add HomeHeader component"
```

---

### Task 2: Implement 3D Flip Carousel

**Files:**
- Create: `Spicesapk/components/spice/ThreeDCarousel.tsx`

- [ ] **Step 1: Implement 3D rotation and parallax using Reanimated**

```tsx
import React from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Text } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.85;
const SPACER = (width - ITEM_WIDTH) / 2;

export const ThreeDCarousel = ({ items }: { items: any[] }) => {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SPACER }}
      >
        {items.map((item, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * ITEM_WIDTH,
              index * ITEM_WIDTH,
              (index + 1) * ITEM_WIDTH,
            ];

            const rotateY = interpolate(
              scrollX.value,
              inputRange,
              [45, 0, -45],
              Extrapolate.CLAMP
            );

            const scale = interpolate(
              scrollX.value,
              inputRange,
              [0.8, 1, 0.8],
              Extrapolate.CLAMP
            );

            return {
              transform: [
                { perspective: 1000 },
                { rotateY: `${rotateY}deg` },
                { scale }
              ],
            };
          });

          return (
            <View key={item.id} style={{ width: ITEM_WIDTH, paddingVertical: 20 }}>
              <Animated.View style={[styles.card, animatedStyle]}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.info}>
                  <Text variant="h2" family="display" style={{ color: '#E2B714' }}>{item.title}</Text>
                  <Text variant="body1" style={{ color: '#FFF' }}>{item.subtitle}</Text>
                </View>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 250 },
  card: { flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#16213E' },
  image: { ...StyleSheet.absoluteFillObject },
  info: { position: 'absolute', bottom: 20, left: 20 },
});
```

- [ ] **Step 2: Commit**

```bash
git add Spicesapk/components/spice/ThreeDCarousel.tsx
git commit -m "feat: implement ThreeDCarousel with flip effects"
```

---

### Task 3: Build Spice-Jar Refresh Control

**Files:**
- Create: `Spicesapk/components/ui/SpiceJarRefresh.tsx`

- [ ] **Step 1: Implement the tilting jar and golden pour effect**

```tsx
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolate,
  useDerivedValue
} from 'react-native-reanimated';
import { Text } from '@/components/Themed';

export const SpiceJarRefresh = ({ progress }: { progress: Animated.SharedValue<number> }) => {
  const rotate = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [0, 45]);
  });

  const jarStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: interpolate(progress.value, [0, 1], [0.8, 1.2]) }],
    opacity: progress.value,
  }));

  const powderHeight = useSharedValue(0);
  
  useEffect(() => {
    if (progress.value > 0.9) {
      powderHeight.value = withRepeat(withTiming(40, { duration: 1000 }), -1, true);
    } else {
      powderHeight.value = 0;
    }
  }, [progress.value]);

  const powderStyle = useAnimatedStyle(() => ({
    height: powderHeight.value,
    opacity: interpolate(progress.value, [0.8, 1], [0, 1]),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.jarContainer, jarStyle]}>
        <Text style={{ fontSize: 40 }}>🏺</Text>
      </Animated.View>
      <Animated.View style={[styles.powder, powderStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  jarContainer: { zIndex: 2 },
  powder: { width: 3, backgroundColor: '#E2B714', borderRadius: 2, marginTop: -10 },
});
```

- [ ] **Step 2: Commit**

```bash
git add Spicesapk/components/ui/SpiceJarRefresh.tsx
git commit -m "feat: add SpiceJarRefresh component"
```

---

### Task 4: Final Integration on Home Screen

**Files:**
- Modify: `Spicesapk/app/(tabs)/index.tsx`

- [ ] **Step 1: Replace components and add staggered animations**

```tsx
// Integration on Spicesapk/app/(tabs)/index.tsx
import { HomeHeader } from '@/components/ui/HomeHeader';
import { ThreeDCarousel } from '@/components/spice/ThreeDCarousel';
import { SpiceJarRefresh } from '@/components/ui/SpiceJarRefresh';

// ... update render method to use new components
// ... wrap sections in Animated.View with staggered delays
```

- [ ] **Step 2: Commit**

```bash
git add Spicesapk/app/(tabs)/index.tsx
git commit -m "feat: integrate new Home Screen components and animations"
```
