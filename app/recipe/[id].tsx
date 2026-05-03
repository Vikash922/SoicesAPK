import React from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Button } from '@/components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const RECIPE_MOCK = {
  id: '1',
  name: 'Authentic Kashmiri Biryani',
  image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800',
  prepTime: '20 mins',
  cookTime: '45 mins',
  servings: '4 People',
  difficulty: 'Medium',
  description: 'A fragrant, royal rice dish from the valleys of Kashmir, known for its rich use of saffron, dry fruits, and aromatic whole spices.',
  ingredients: [
    { name: 'Basmati Rice', qty: '500g' },
    { name: 'Mutton / Chicken', qty: '500g' },
    { name: 'Kashmiri Saffron', qty: '1g', isSpice: true },
    { name: 'Green Cardamom', qty: '5-6 pods', isSpice: true },
    { name: 'Cinnamon Stick', qty: '1 inch', isSpice: true },
    { name: 'Cloves', qty: '4-5', isSpice: true },
    { name: 'Bay Leaf', qty: '2', isSpice: true },
  ],
  steps: [
    'Wash and soak basmati rice for 30 minutes.',
    'Soak saffron threads in warm milk and keep aside.',
    'In a large pot, boil water with whole spices (cardamom, cinnamon, cloves, bay leaf).',
    'Cook rice until 70% done and drain the water.',
    'In a separate pan, cook the meat with aromatics until tender.',
    'Layer the rice and meat in a heavy-bottomed pot.',
    'Drizzle saffron milk and ghee over the top.',
    'Seal the pot and cook on low heat (Dum) for 15-20 minutes.',
  ]
};

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="share-social-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: RECIPE_MOCK.image }} style={styles.heroImg} />
          <LinearGradient 
            colors={['transparent', 'rgba(0,0,0,0.8)']} 
            style={styles.heroOverlay}
          />
          <View style={styles.heroContent}>
            <View style={[styles.difficultyBadge, { backgroundColor: colors.saffron }]}>
              <Text variant="overline" family="badge" style={{ color: '#000' }}>{RECIPE_MOCK.difficulty}</Text>
            </View>
            <Text variant="display2" family="display" style={styles.recipeName}>{RECIPE_MOCK.name}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Info Bar */}
          <View style={styles.infoBar}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={colors.saffron} />
              <Text variant="caption" style={styles.infoLabel}>Prep</Text>
              <Text variant="body2" family="heading">{RECIPE_MOCK.prepTime}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="restaurant-outline" size={20} color={colors.saffron} />
              <Text variant="caption" style={styles.infoLabel}>Cook</Text>
              <Text variant="body2" family="heading">{RECIPE_MOCK.cookTime}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color={colors.saffron} />
              <Text variant="caption" style={styles.infoLabel}>Serves</Text>
              <Text variant="body2" family="heading">{RECIPE_MOCK.servings}</Text>
            </View>
          </View>

          <Text variant="body2" style={styles.description}>{RECIPE_MOCK.description}</Text>

          {/* Ingredients */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
               <Text variant="h3" family="heading">Ingredients</Text>
               <TouchableOpacity>
                  <Text variant="caption" family="heading" style={{ color: colors.saffron }}>ADD ALL SPICES</Text>
               </TouchableOpacity>
            </View>
            <View style={styles.ingredientsList}>
              {RECIPE_MOCK.ingredients.map((ing, i) => (
                <View key={i} style={[styles.ingredientItem, { borderBottomColor: colors.tabIconDefault + '20' }]}>
                   <View style={styles.ingLeft}>
                      <View style={[styles.dot, { backgroundColor: ing.isSpice ? colors.saffron : colors.tabIconDefault }]} />
                      <Text variant="body2">{ing.name}</Text>
                   </View>
                   <Text variant="body2" family="heading">{ing.qty}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Steps */}
          <View style={styles.section}>
            <Text variant="h3" family="heading" style={styles.sectionTitle}>Preparation Steps</Text>
            {RECIPE_MOCK.steps.map((step, i) => (
              <View key={i} style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: colors.saffron + '20' }]}>
                   <Text variant="caption" family="heading" style={{ color: colors.saffron }}>{i + 1}</Text>
                </View>
                <Text variant="body2" style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Floating CTA */}
      <View style={[styles.floatingCTA, { backgroundColor: colors.background, borderTopColor: colors.tabIconDefault + '20' }]}>
         <Button 
           title="GET ALL SPICES FOR THIS RECIPE" 
           onPress={() => {}} 
           style={styles.ctaBtn}
         />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },
  heroContainer: { width: '100%', height: 400 },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroContent: { position: 'absolute', bottom: 40, left: 24, right: 24 },
  difficultyBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 12 },
  recipeName: { color: '#fff' },
  content: { padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: 'transparent' },
  infoBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    borderRadius: 20, 
    backgroundColor: 'rgba(226, 183, 20, 0.05)',
    marginBottom: 24
  },
  infoItem: { alignItems: 'center' },
  infoLabel: { opacity: 0.5, marginTop: 4 },
  description: { lineHeight: 22, opacity: 0.8, marginBottom: 30 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { marginBottom: 15 },
  ingredientsList: { gap: 12 },
  ingredientItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  ingLeft: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 12 },
  stepItem: { flexDirection: 'row', marginBottom: 20 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  stepText: { flex: 1, lineHeight: 22, opacity: 0.8 },
  floatingCTA: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 40, borderTopWidth: 1 },
  ctaBtn: { height: 56 },
});
