# Design Spec: SpiceCart Home Screen (Main Hub)

**Date:** 2026-05-03
**Status:** Draft

## 1. Overview
The Home Screen is the central hub of the SpiceCart app. It provides a premium, visually rich entry point for users to discover products, deals, and recipes.

## 2. Layout Structure
- **Sticky Header:** Top bar with Logo, Search input, Notification bell, and Location selector.
- **Hero Carousel:** 3D Flip effect banners with parallax text layers.
- **Category Grid:** Horizontal scroll of category cards with spring-back interactions.
- **Sectioned Content:**
  - Trending Now (2-column grid)
  - Recipe Pairings (Horizontal scroll)
  - Combo Packs (Horizontal scroll)
  - Organic Picks (Horizontal scroll)

## 3. Complex Interactions & Animations

### Spice-Jar Refresh (Custom Pull-to-Refresh)
- **Visuals:** A spice jar (🏺) that tilts as the user pulls down.
- **Physics:** "Viscous & Rich" pour effect. Once the threshold is hit, golden "powder" particles flow down.
- **Tech:** `react-native-reanimated` for gesture handling and tilt; `Canvas` (Skia) or multiple `Animated.View` particles for the pour effect.

### 3D Banner Carousel
- **Effect:** Cards rotate in 3D space during transition.
- **Parallax:** Background images and foreground text layers move at different speeds.

### Micro-interactions
- **Staggered Entrance:** Sections and grid items fade/slide in sequentially on first load.
- **Spring Categories:** Category cards scale up to 1.15 on press and spring back.
- **Flying Cart Animation:** When "Add to Cart" is pressed, a composite "ghost" element (miniature product image surrounded by a Saffron Gold glowing trail) follows a curved bezier path from the product card to the cart tab icon.

## 4. Components to Build
- `HomeHeader`: Sticky top bar.
- `SpiceJarRefreshControl`: Custom refresh component.
- `ThreeDCarousel`: Enhanced banner component.
- `RecipeCard`: Horizontal card for pairings.
- `ComboCard`: Horizontal card for bundles.

## 5. Success Criteria
- Home screen loads smoothly with staggered animations.
- Custom refresh feels "premium" and responsive.
- 3D carousel provides a high-end feel.
- Layout perfectly matches the "SpiceCart" branding.
