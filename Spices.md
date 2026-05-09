
# 🌶️ SpiceCart — Full UI/UX Design & Development Blueprint

> A premium spice e-commerce platform inspired by Amazon/Flipkart, exclusively for spices.

---

## 📋 Table of Contents

1. Brand Identity & Color System
2. Typography System
3. App Architecture & Navigation
4. Complete Screen-by-Screen UI Design
5. Component Library
6. Animation & Micro-interaction Library
7. Tech Stack & Architecture
8. State Management & Data Flow
9. API Design & Backend
10. Database Schema
11. Accessibility & Performance
12. Full File Structure
13. Development Roadmap
14. Key Metrics to Track

---

## 1. 🎨 Brand Identity & Color System

### Primary Color Palette (Spice-Inspired)

| Color | Hex | Usage | WCAG Contrast |
|-------|-----|-------|--------------|
| Saffron Gold | #E2B714 | Primary brand, CTAs, highlights | Black contrast |
| Turmeric Yellow | #F4C430 | Secondary accents, badges, stars | Black contrast |
| Chili Red | #C41E3A | Sale tags, errors, urgency, low stock | White contrast |
| Cardamom Green | #2E8B57 | Organic labels, success states, in-stock | White contrast |
| Cinnamon Brown | #8B4513 | Headers, rich textures, nav | White contrast |
| Pepper Dark | #1A1A2E | Primary text, dark mode base | White contrast |
| Cream White | #FFF8E7 | Light backgrounds, cards | Dark contrast |
| Paprika Orange | #E8590C | Warnings, offer CTAs | White contrast |
| Mint Light | #4A7C59 | Freshness indicators, subtle accents | White contrast |

### Dark Mode Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Dark Background | #1A1A2E | Main background |
| Card Dark | #16213E | Card surfaces |
| Surface Dark | #0F3460 | Elevated surfaces and modals |
| Saffron Glow | #E2B71480 | Primary with 50% opacity |
| Text Primary | #F5F5F5 | Main body text |
| Text Secondary | #A0A0B0 | Subtitles, captions |

### Semantic Colors

| Type | Color | Hex |
|------|-------|-----|
| Success | Green | #2E8B57 |
| Warning | Orange | #E8590C |
| Error | Red | #C41E3A |
| Info | Blue | #3498DB |
| Organic and Badge | Mint | #4A7C59 |

---

## 2. 🔤 Typography System

### Font Stack

| Level | Font | Weight | Use |
|-------|------|--------|-----|
| Display | Playfair Display | 700, 800 | Hero banners, splash screen |
| Headings | Poppins | 600, 700 | Section titles, card titles |
| Body | Inter | 400, 500 | Product descriptions, reviews |
| Price | DM Sans | 700 | Price tags, amounts |
| Badge and Tag | Space Grotesk | 600 | Sale badges, category pills |

### Type Scale (Responsive)

| Token | Size | Line-Height | Use |
|-------|------|-------------|-----|
| Display1 | 36sp | 44sp | Splash, Hero |
| Display2 | 30sp | 38sp | Feature headers |
| H1 | 24sp | 32sp | Screen titles |
| H2 | 20sp | 28sp | Section headers |
| H3 | 18sp | 26sp | Card titles |
| Body1 | 16sp | 24sp | Primary body |
| Body2 | 14sp | 20sp | Secondary text |
| Caption | 12sp | 16sp | Metadata, timestamps |
| Overline | 10sp | 16sp | Labels, letter-spacing: 1.5 |
| Price | 22sp | bold | Current price |
| Strike | 14sp | 400, line-through | Original price |

---

## 3. 📱 App Architecture and Navigation

### Bottom Tab Bar

| Tab | Icon | Screen |
|-----|------|--------|
| Home | House | Main hub with banners, categories, deals |
| Explore | Magnifying Glass | Full catalog with filters |
| Cart | Shopping Cart | Cart management |
| Wishlist | Heart | Saved products |
| Profile | User | Settings and account |

### Full Screen Map

SPLASH SCREEN ↓ ONBOARDING (3 screens, first-time only) ↓ LOGIN / SIGNUP ├── Phone OTP Login ├── Email/Password ├── Google OAuth └── Guest Mode (restricted: browse only, no purchase) ↓ HOME (Main Hub) ├── Search Bar → Search Results Page ├── Category Carousel │ ├── Whole Spices │ ├── Ground Spices │ ├── Spice Blends and Masalas │ ├── Herbs and Leaves │ ├── Exotic and Rare Spices │ ├── Organic Spices │ └── Regional Specialties ├── Flash Deals Section ├── Trending Products ├── Featured Brands └── Recipe-Paired Spices ↓ EXPLORE (Full catalog) ├── Filter and Sort Panel ├── Grid/List Toggle ├── Infinite Scroll Products └── AI Recommendations ↓ PRODUCT DETAIL PAGE ├── Image Gallery (zoom, 360) ├── Nutrition and Origin Info ├── Spice Heat Meter (1-5) ├── Recipe Suggestions ├── Reviews and Ratings ├── Q&A Section ├── Similar Products └── Add to Cart / Wishlist ↓ CART ├── Item Management (qty, remove) ├── Coupon/Promo Code ├── Spice Pairing Suggestions ├── Price Breakdown └── Checkout ↓ CHECKOUT ├── Address Selection/Add ├── Delivery Scheduling ├── Payment Methods ├── Order Summary └── Order Confirmation ↓ ORDER TRACKING ├── Real-time Status ├── Map Integration └── Delivery ETA ↓ PROFILE ├── My Orders ├── Addresses ├── Payments ├── Wishlist ├── Notifications ├── Settings (Theme, Lang, Region) ├── Help and Support └── About / Logout


---

## 4. 🖥️ Complete Screen-by-Screen UI Design

### Screen 1: Splash Screen (3 seconds)

**Layout:**

- Background: Dark gradient (#1A1A2E to #16213E)
- Center: Animated spice icon with particle effects
- Below: "SPICECART" in Playfair Display, Gold color
- Subtitle: "The World of Spices" with fade in
- Bottom: Loading bar with amber gradient

**Animations:**

- Spice icon: Scale 0 to 1.2 to 1, rotation 0 to 360 degrees, duration 1.5s
- Floating particles: 15-20 spice emoji floating upward
- Logo text: Letter-by-letter typing animation
- Loading bar: Smooth width animation 0% to 100%
- Exit: Fade out + scale down, transition to Onboarding

---

### Screen 2: Onboarding (3 slides, swipeable)

**Slide 1: "Discover Authentic Spices"**

- Lottie animation of a bustling spice market with floating labels
- Title: "Discover Authentic Spices" (H2, Poppins Bold)
- Subtitle: "From farm to your kitchen, handpicked premium spices from global origins"
- Page indicator dots: filled, empty, empty
- Skip button in top-right corner

**Slide 2: "Every Spice, Every Blend"**

- Animated spice jars opening and mixing animation
- Title: "Every Spice, Every Blend"
- Subtitle: "1000+ varieties from 50+ origin countries"
- Page indicator dots: empty, filled, empty

**Slide 3: "Cook with Confidence"**

- Cooking pot with spice rain animation (Lottie)
- Title: "Cook with Confidence"
- Subtitle: "AI-powered recipe matching and spice pairings"
- Page indicator dots: empty, empty, filled
- "GET STARTED" CTA button in Saffron Gold

---

### Screen 3: Login / Signup

**Layout:**

- Top: Back arrow + SpiceCart logo
- Brand logo with "Welcome back!" subtitle
- Phone number input (with country code)
- Password input (with show/hide toggle)
- "LOGIN" button (Saffron Gold, full width)
- Divider: "or continue with"
- Social login row: Google, Phone OTP, Apple (icon buttons)
- Bottom: "New here? Sign Up" link
- Subtle: "Continue as Guest" link

**Animations:**

- Background: Animated gradient mesh (amber waves)
- Login button: Shimmer effect on hover/press
- Social buttons: Scale 0.95 on press with ripple
- Input fields: Focus border animation (gold glow)
- Error: Shake animation on validation fail

---

### Screen 4: Home Screen (Main Hub)

**Top Bar:**

- SpiceCart logo (left)
- Search bar with placeholder "Search spices..." (center, expandable)
- Notification bell icon with badge (right)
- Location pill: "Delivering to Mumbai v" below search

**Hero Banner Carousel:**

- Full-width banner with flash deals
- Example: "40% OFF on Saffron" with "Shop Now" CTA
- Auto-scroll every 5 seconds
- Dots indicator below

**Categories Section:**

- Section header: "CATEGORIES"
- Horizontal scrollable row of category cards
- Each card: Icon + Label (e.g., jar icon + "Whole Spices")
- Cards have gradient backgrounds matching category theme

**Trending Products:**

- Section header: "TRENDING NOW" with "See All" link
- 2-column product card grid
- Each card: Image, Name, Rating, Price (current + strikethrough), Quick action buttons (cart + heart)

**Recipe Pairings:**

- Section header: "RECIPE PAIRINGS" with "See All" link
- Horizontal scrollable recipe cards
- Each card: Recipe image, name, required spices, "Get All Spices" CTA with price

**Combo Packs:**

- Section header: "COMBO PACKS" with "See All" link
- 2-column combo offer cards
- Each card: Image, name, pack size, price

**Organic Picks:**

- Section header: "ORGANIC PICKS" with "See All" link
- Horizontal scrollable cards with organic badge

**Home Screen Animations:**

- Banner: Auto-scroll with parallax, 3D card flip on swipe
- Categories: Spring animation on tap, scale 1 to 1.15 to 1
- Product cards: Staggered fade-in on scroll (IntersectionObserver)
- Add to cart: Item flies to cart icon (path animation)
- Wishlist: Heart fills with pulsing animation
- Pull to refresh: Custom spice-jar pour animation
- Flash deal: Countdown timer with flip-clock animation

---

### Screen 5: Explore / Search Results

**Layout:**

- Top: Back arrow + Search input (pre-filled) + Clear button
- Filter chips row (scrollable): Whole, Ground, Organic, Price ranges, Rating, Heat level, Origin
- Sort By dropdown: Popularity, Price Low-High, Price High-Low, Newest, Rating
- Grid/List toggle icon
- 2-column product grid (or list view)
- Infinite scroll with loading indicator

**Animations:**

- Search: Live suggestions with typing debounce (300ms)
- Filter chips: Spring pop animation on select
- Grid/List toggle: Shared axis transition
- Scroll: Parallax on product images
- Loading: Skeleton shimmer animation

---

### Screen 6: Product Detail Page (PDP)

**Top Nav:**

- Back arrow, Product title, Cart icon, Wishlist heart, More menu

**Image Gallery:**

- Full-width swipeable image carousel
- Pinch to zoom on images
- Dots indicator below

**Trust Badges Row:**

- ORGANIC badge (green leaf icon)
- PREMIUM badge (crown icon)
- AUTHENTIC badge (verified icon)

**Product Info:**

- Product name (H3, Poppins Bold)
- Brand name (link to brand page)
- Star rating with count (e.g., 4.8 with 2,847 reviews)
- Spice heat indicator (chili icon with level)
- Price block: Current price (bold) + Original price (strikethrough) + Discount percentage
- "Inclusive of all taxes" note

**Variants Section:**

- Size selector pills (e.g., 1g, 2g, 5g, 10g)
- Active state: Filled with Saffron Gold

**Origin and Info Section:**

- Location icon + Origin (e.g., "Kashmir, India")
- Tag icon + "100% Authentic"
- Package icon + "Ships in 24hrs"
- Refresh icon + "Easy Returns"

**Spice Heat Meter:**

- Visual bar from green (mild) to red (hot)
- Numeric value (1-10 scale)
- Animated fill on scroll into view

**Nutrition Section (per 100g):**

- Calories, Fiber, Iron, Vitamin A values

**Recipes Using This:**

- Horizontal scroll of recipe mini-cards
- Each: Recipe image, name, "View" button

**Reviews Section:**

- Overall rating (large number + stars)
- Rating distribution bars (5-star to 1-star with percentages)
- "Write Review" button with photo support
- Individual reviews with expand/collapse

**Q&A Section:**

- List of questions with answers
- "Ask a question" input

**Sticky Bottom Bar:**

- Wishlist heart button (left)
- "ADD TO CART" button with price (right, Saffron Gold)

**PDP Animations:**

- Image gallery: SharedElement transition from list
- Pinch zoom: Smooth with double-tap reset
- Heat meter: Animated fill when visible
- Add to cart: Button morph + check mark animation
- Sticky bar: Slides up on scroll
- Trust badges: Fade in staggered
- Reviews: Expand/collapse smooth transition

---

### Screen 7: Cart

**Layout:**

- Top: Back arrow + "My Cart" title + item count
- Cart items list: Each with product image, name, variant, price, quantity stepper (+/-), delete icon
- Spice Pairing Suggestion card (AI-powered): "Add Cardamom for your Biryani recipe? +299" with Add/Dismiss buttons
- Coupon input: Text field + Apply button
- Applied coupon display with discount amount and remove option
- Price breakdown: Subtotal, Discount, Delivery fee, Total
- Sticky bottom: "PROCEED TO CHECKOUT" button with total amount

**Cart Animations:**

- Swipe to delete: Slide left animation, list collapses smoothly
- Quantity change: Number spring animation
- Coupon apply: Success confetti mini-burst
- Price update: Counter animation (old price slides out, new slides in)
- Pairing suggestion: Slide-in from right
- Empty cart: Lottie animation of empty spice jar

---

### Screen 8: Checkout

**Step Indicator:**

- Visual progress bar: Address → Delivery → Payment → Confirm
- Current step highlighted in Saffron Gold

**Step 1: Delivery Address**

- Saved address card with radio selection
- Edit and Add new address buttons
- Address shows: Name, full address, phone number, type tag (Home/Work)

**Step 2: Delivery Slot**

- Horizontal scrollable date options
- Time slot chips per date (e.g., 9AM-12PM, 3-6PM)
- Selected slot highlighted

**Step 3: Payment**

- Radio options: UPI (GPay/PhonePe), Credit/Debit Card, Net Banking, Cash on Delivery, SpiceCart Wallet
- Saved card display with CVV input
- UPI ID input field

**Order Summary:**

- Item count and total
- "I agree to Terms and Conditions" checkbox

**Final CTA:**

- "PLACE ORDER" button with lock icon (security indicator)

---

### Screen 9: Order Tracking

**Layout:**

- Top: Back arrow + Order number + Chat icon
- Live map showing delivery path with store and destination markers
- ETA display (e.g., "25 minutes")
- Order timeline with animated step indicators:
  - Order Placed (completed, green check)
    - Confirmed (completed)
      - Packed (completed)
        - Out for Delivery (current, pulsing blue dot)
          - Delivered (pending, gray)
          - Items summary row with product thumbnails
          - Call and Chat action buttons

          ---

          ### Screen 10: Profile

          **Layout:**

          - Top: Back arrow + "My Profile" title + Settings gear icon
          - User card: Avatar, Name, Email, Loyalty tier badge, Spice Points count
          - Menu list with icons:
            - My Orders
              - Saved Addresses
                - Payment Methods
                  - Wishlist
                    - Spice Points
                      - Notifications
                        - Dark Mode toggle
                          - Language selector
                            - AI Recommendations
                              - Help and Support
                                - About
                                  - Logout (red text)
                                  - App version number at bottom

                                  ---

                                  ## 5. 🧩 Component Library

                                  ### Core Components

                                  | Component | Props | Animation | Notes |
                                  |-----------|-------|-----------|-------|
                                  | SpiceSearchBar | placeholder, onSearch, voiceEnabled | Focus expand, ripple | Debounced live search |
                                  | SpiceCategoryCard | icon, label, color, count | Spring tap, scale | Gradient backgrounds |
                                  | SpiceProductCard | product, variant, layout | Stagger fade, fly-to-cart | Grid/List modes |
                                  | SpiceHeatMeter | level (1-10), animated | Animated fill | Color gradient green to red |
                                  | SpicePriceTag | price, originalPrice, discount | Counter slide | Smart rounding |
                                  | SpiceQtyStepper | min, max, value, onChange | Number spring | Haptic feedback |
                                  | SpiceCouponInput | onApply, onSuccess | Success confetti | Auto-validate |
                                  | SpiceRatingBar | rating, count, size | Star fill animation | Half-star support |
                                  | SpiceCountdownTimer | endTime | Flip digits | For flash deals |
                                  | SpiceEmptyState | type, message, action | Lottie loop | Empty cart/order/search |
                                  | SpiceShimmerLoader | variant (card/list/banner) | Shimmer sweep | Skeleton loading |
                                  | SpiceToast | type, message, duration | Slide in/out | Success/error/info |
                                  | SpiceBottomSheet | content, isOpen | Spring slide-up | With backdrop blur |
                                  | SpiceCarousel | items, autoPlay, interval | Page transition | Parallax option |
                                  | SpiceStepIndicator | steps, current | Line animation | Checkout flow |
                                  | SpiceMapView | markers, route | Pin drop | Order tracking |
                                  | SpiceTrustBadge | type, label | Fade stagger | Organic/Premium/Auth |
                                  | SpiceChipFilter | options, selected | Bounce select | Multi-select |
                                  | SpicePullToRefresh | onRefresh | Jar pour Lottie | Custom animation |
                                  | SpiceFloatingCTA | label, price, onClick | Slide up | Sticky bottom bar |

                                  ---

                                  ## 6. 🎬 Animation and Micro-interaction Library

                                  ### A. Page Transitions

                                  | Transition | Library | Duration | Easing |
                                  |------------|---------|----------|--------|
                                  | Shared Axis (Horizontal) | Motion Layout | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
                                  | Shared Element (image list to PDP) | Hero/SharedElement | 400ms | EaseInOut |
                                  | Fade Through (bottom tabs) | Motion Layout | 250ms | EaseOut |
                                  | Container Transform (card to detail) | Material Motion | 350ms | EaseInOutCubic |
                                  | Slide Up (bottom sheet, modal) | Custom | 300ms | Spring (damping: 0.8) |
                                  | Slide + Fade (notification) | Custom | 200ms | EaseOut |

                                  ### B. Micro-Interactions

                                  | Interaction | Animation | Duration | Trigger |
                                  |-------------|-----------|----------|---------|
                                  | Add to Cart | Item flies to cart icon with arc path | 600ms | Button tap |
                                  | Wishlist | Heart fills with pulse + particles | 400ms | Heart tap |
                                  | Quantity plus/minus | Number slides up/down | 200ms | Stepper tap |
                                  | Swipe Delete | Item slides out left, list collapses | 300ms | Swipe gesture |
                                  | Pull Refresh | Spice jar tilts, grains pour out | Loop | Pull down |
                                  | Search Focus | Bar expands, backdrop blurs, suggestions rise | 250ms | Tap search |
                                  | Filter Select | Chip bounces with spring | 200ms | Chip tap |
                                  | Rating Hover | Stars fill sequentially | 100ms each | Touch |
                                  | Coupon Apply | Check mark draws, badge bounces | 500ms | Tap apply |
                                  | Price Change | Old price slides out, new slides in | 300ms | Qty change |
                                  | Scroll Parallax | Product images move at 0.8x scroll | Continuous | Scroll |
                                  | Skeleton Shimmer | Gradient sweeps left to right | 1.5s loop | Loading |
                                  | Button Press | Scale 1 to 0.95 + ripple | 150ms | Press |
                                  | Success Order | Spice confetti explosion | 1000ms | Order placed |
                                  | Error Shake | Input field shakes left-right | 300ms | Validation fail |
                                  | Tab Switch | Icon morphs, indicator slides | 250ms | Tab tap |
                                  | Banner Auto-scroll | 3D perspective swipe | 500ms | Auto 5s interval |
                                  | Toast | Slides up from bottom, auto-dismiss | 200ms in, 200ms out | Action result |

                                  ### C. Lottie Animations

                                  | Animation | File | Where Used | Approx Size |
                                  |-----------|------|-----------|-------------|
                                  | Spice Splash | splash_spice.json | Splash screen | 150KB |
                                  | Empty Jar | empty_jar.json | Empty cart/wishlist | 80KB |
                                  | Jar Pour | jar_pour.json | Pull to refresh | 60KB |
                                  | Spice Confetti | spice_confetti.json | Order success | 100KB |
                                  | Cooking Pot | cooking_pot.json | Recipe pairing | 70KB |
                                  | Delivery Truck | delivery_truck.json | Order confirmation | 90KB |
                                  | Spice Mill | spice_mill.json | Loading states | 50KB |
                                  | Reward Star | reward_star.json | Points earned | 40KB |
                                  | Success Check | success_check.json | Payment confirmed | 30KB |
                                  | Error Pepper | error_pepper.json | Error states | 45KB |

                                  ### D. Rive Animations (Interactive, Lightweight)

                                  | Animation | State Machine | Where Used |
                                  |-----------|--------------|-----------|
                                  | Spice Mascot | idle to wave to cook | Home floating assistant |
                                  | Search Loader | input to processing to done | Search loading |
                                  | Heat Meter | level (0-10) | Product detail |
                                  | Cart Badge | count (0-99) | Cart icon counter |

                                  ---

                                  ## 7. ⚙️ Tech Stack and Architecture

                                  ### Mobile App (Primary)

                                  | Category | Technology |
                                  |----------|-----------|
                                  | Framework | React Native (Expo SDK 50) |
                                  | Web Version | Next.js 14 (App Router) |
                                  | Admin Dashboard | React + Vite |
                                  | Language | TypeScript 5.3+ |
                                  | State Management | Zustand + React Query (TanStack Query) |
                                  | Navigation | Expo Router v3 (file-based) |
                                  | Styling | NativeWind (TailwindCSS) |
                                  | Animations | Reanimated 3 + Moti + Lottie + Rive |
                                  | Images | Expo Image (BlurHash) |
                                  | Authentication | Clerk / Supabase Auth |
                                  | Local Storage | MMKV + AsyncStorage |
                                  | Analytics | PostHog + Mixpanel |
                                  | Crash Reporting | Sentry |
                                  | Push Notifications | Expo Notifications + FCM |
                                  | Maps | React Native Maps |
                                  | Payment | Razorpay / Stripe |
                                  | Search | Algolia |
                                  | Forms | React Hook Form + Zod |
                                  | Testing | Jest + Detox + Testing Library |
                                  | CI/CD | EAS Build + GitHub Actions |
                                  | E2E Testing | Maestro |

                                  ### Backend

                                  | Category | Technology |
                                  |----------|-----------|
                                  | Runtime | Node.js 20 LTS |
                                  | Framework | Fastify 4 / Hono |
                                  | Database | PostgreSQL 16 (Supabase) |
                                  | Cache | Redis 7 (Upstash) |
                                  | Search | Meilisearch / Algolia |
                                  | File Storage | Cloudflare R2 / S3 |
                                  | Job Queue | BullMQ / Inngest |
                                  | Authentication | Supabase Auth |
                                  | ORM | Drizzle ORM |
                                  | Real-time | Supabase Realtime |
                                  | Email | Resend |
                                  | Push | Firebase Cloud Messaging |
                                  | Payment | Razorpay + Stripe |
                                  | Deployment | Docker + Fly.io / Railway |
                                  | Monitoring | Grafana + Prometheus |
                                  | Analytics | PostHog |
                                  | API | tRPC / REST hybrid |
                                  | Validation | Zod |

                                  ### Architecture Diagram

+-----------+ +-----------+ +-----------+ | Mobile | | Web | | Admin | | (Expo) | | (Next.js) | | (Vite) | +-----+-----+ +-----+-----+ +-----+-----+ | | | +--------+-----+------+------+ | | v v +----------------+ +-----------+ | API Gateway | | Webhooks | | (Cloudflare | | (Hono) | | Workers) | | | | Rate Limiting | | | | + Auth | | | +-------+--------+ +-----+-----+ | | +--------+---------+ | v +--------+--------+ | tRPC Server | | (Fastify) | +--------+--------+ | +--------------+--------------+ | | | v v v +-----------+ +----------+ +----------+ | PostgreSQL| | Redis | | S3/R2 | | DB | | Cache | | Storage | +-----------+ +-----

---

## 8. 🗃️ State Management and Data Flow

### Zustand Store Structure

**1. Auth Store**

- user: User or null
- isAuthenticated: boolean
- login(credentials): Promise
- logout(): void
- guestMode: boolean

**2. Cart Store (persisted with MMKV)**

- items: CartItem array
- couponCode: string or null
- discount: number
- addItem(product, qty, variant): void
- removeItem(productId): void
- updateQty(productId, qty): void
- clearCart(): void
- applyCoupon(code): Promise boolean
- total: number (computed)
- itemCount: number (computed)

**3. Wishlist Store (persisted)**

- items: WishlistItem array
- toggle(product): void
- isInWishlist(productId): boolean

**4. Search and Filter Store**

- query: string
- filters: FilterState
- sortBy: SortOption
- viewMode: grid or list
- setQuery(q): void
- toggleFilter(key, value): void
- clearFilters(): void

**5. UI Store**

- theme: light or dark or system
- onboardingComplete: boolean
- activeTab: string
- isSearchOpen: boolean
- showToast(type, message): void

### React Query Cache Strategy

| Data Type | Stale Time |
|-----------|-----------|
| Categories | 30 minutes |
| Products | 5 minutes |
| Search Results | 2 minutes |
| Cart | 30 seconds |
| User Profile | 10 minutes |
| Orders | 5 minutes |
| Reviews | 15 minutes |
| Recommendations | 10 minutes |
| Flash Deals | 10 seconds |

---

## 9. 📡 API Design and Backend

### REST + tRPC Endpoints

**Auth Endpoints**

- POST /auth/phone/send-otp
- POST /auth/phone/verify-otp
- POST /auth/email/login
- POST /auth/email/register
- POST /auth/refresh
- POST /auth/logout

**Products Endpoints**

- GET /products (paginated, filtered)
- GET /products/:id (detail)
- GET /products/:id/variants (variant options)
- GET /products/:id/reviews (paginated)
- POST /products/:id/reviews (create review)
- GET /products/:id/related (similar products)
- GET /products/:id/recipes (paired recipes)
- GET /products/search (Algolia-powered)

**Categories Endpoints**

- GET /categories (all categories)
- GET /categories/:slug/products (category products)
- GET /categories/tree (hierarchical tree)

**Cart Endpoints**

- GET /cart (get cart)
- POST /cart/items (add item)
- PATCH /cart/items/:id (update quantity)
- DELETE /cart/items/:id (remove item)
- POST /cart/coupon (apply coupon)
- DELETE /cart/coupon (remove coupon)

**Orders Endpoints**

- GET /orders (list orders)
- GET /orders/:id (order detail)
- POST /orders (create order)
- POST /orders/:id/cancel (cancel order)
- GET /orders/:id/track (track order)

**Wishlist Endpoints**

- GET /wishlist (list items)
- POST /wishlist/:productId (add)
- DELETE /wishlist/:productId (remove)

**User Endpoints**

- GET /user/profile (profile info)
- PATCH /user/profile (update profile)
- GET /user/addresses (list addresses)
- POST /user/addresses (add address)
- PATCH /user/addresses/:id (update address)
- DELETE /user/addresses/:id (delete address)
- GET /user/points (spice points)

**Payment Endpoints**

- POST /payment/create-order (Razorpay order)
- POST /payment/verify (verify payment)
- POST /payment/webhook (Razorpay webhook)
- GET /payment/methods (saved methods)

**Admin Endpoints**

- GET /admin/dashboard (stats)
- CRUD /admin/products (product management)
- CRUD /admin/categories (category management)
- CRUD /admin/orders (order management)
- CRUD /admin/coupons (coupon management)
- CRUD /admin/users (user management)
- POST /admin/banners (banner management)
- GET /admin/analytics (analytics)

---

## 10. 🗄️ Database Schema

### Core Tables

**users**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| email | varchar | Unique |
| phone | varchar | Unique, nullable |
| name | varchar | |
| avatar_url | text | |
| loyalty_points | integer | Default 0 |
| tier | varchar | bronze/silver/gold/platinum |
| created_at | timestamp | |
| updated_at | timestamp | |

**addresses**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| line1 | varchar | |
| line2 | varchar | Nullable |
| city | varchar | |
| state | varchar | |
| pincode | varchar | |
| country | varchar | |
| is_default | boolean | |
| type | varchar | home or work |

**categories**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | varchar | |
| slug | varchar | Unique |
| icon_url | text | |
| color_hex | varchar | |
| parent_id | uuid | FK self-reference, nullable |
| display_order | integer | |
| is_active | boolean | |

**products**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | varchar | |
| slug | varchar | Unique |
| description | text | |
| short_description | varchar | |
| category_id | uuid | FK to categories |
| brand_id | uuid | FK to brands |
| origin_country | varchar | |
| region | varchar | |
| spice_heat_level | integer | 1-10 |
| is_organic | boolean | |
| is_premium | boolean | |
| nutrition_info | jsonb | |
| storage_tips | text | |
| images | jsonb | Array of image URLs |
| search_vector | tsvector | Full-text search |
| avg_rating | decimal | |
| review_count | integer | |
| total_sold | integer | |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

**product_variants**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| product_id | uuid | FK to products |
| weight_value | decimal | |
| weight_unit | varchar | g, kg, oz |
| mrp | decimal | Maximum retail price |
| selling_price | decimal | |
| stock_quantity | integer | |
| sku | varchar | Unique |
| is_default | boolean | |

**brands**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | varchar | |
| slug | varchar | Unique |
| logo_url | text | |
| description | text | |
| is_verified | boolean | |

**carts**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| coupon_id | uuid | FK to coupons, nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

**cart_items**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| cart_id | uuid | FK to carts |
| product_id | uuid | FK to products |
| variant_id | uuid | FK to product_variants |
| quantity | integer | |
| price_at_addition | decimal | |

**orders**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| order_number | varchar | Unique (e.g., SPC-2847) |
| status | varchar | pending/confirmed/packed/shipped/delivered/cancelled |
| subtotal | decimal | |
| discount | decimal | |
| delivery_fee | decimal | |
| total | decimal | |
| coupon_id | uuid | FK to coupons, nullable |
| address_snapshot | jsonb | Address at order time |
| payment_method | varchar | |
| payment_id | varchar | Razorpay/Stripe payment ID |
| tracking_id | varchar | Nullable |
| delivery_partner | varchar | Nullable |
| estimated_delivery | timestamp | |
| delivered_at | timestamp | Nullable |
| created_at | timestamp | |

**order_items**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| order_id | uuid | FK to orders |
| product_id | uuid | FK to products |
| variant_id | uuid | FK to product_variants |
| quantity | integer | |
| price | decimal | Price at order time |
| product_snapshot | jsonb | Product details at order time |

**reviews**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| product_id | uuid | FK to products |
| rating | integer | 1-5 |
| title | varchar | |
| body | text | |
| images | jsonb | Array of URLs, nullable |
| is_verified_purchase | boolean | Auto-set based on order history |
| helpful_count | integer | |
| created_at | timestamp | |

**wishlists**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| product_id | uuid | FK to products |
| created_at | timestamp | |

**coupons**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| code | varchar | Unique |
| type | varchar | flat or percent |
| value | decimal | |
| min_order | decimal | Nullable |
| max_discount | decimal | Nullable |
| usage_limit | integer | Nullable |
| usage_count | integer | Default 0 |
| valid_from | timestamp | |
| valid_until | timestamp | |
| is_active | boolean | |

**recipes**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | varchar | |
| slug | varchar | Unique |
| image_url | text | |
| prep_time | integer | Minutes |
| cook_time | integer | Minutes |
| servings | integer | |
| cuisine_type | varchar | |
| ingredients | jsonb | Array of ingredient objects |
| steps | jsonb | Array of step objects |
| spice_pairings | jsonb | Array of product IDs |

**flash_deals**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| product_id | uuid | FK to products |
| variant_id | uuid | FK to product_variants |
| discount_percent | decimal | |
| start_time | timestamp | |
| end_time | timestamp | |
| max_units | integer | |
| sold_units | integer | Default 0 |
| is_active | boolean | |

**notifications**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| type | varchar | order_update/promotional/review_reminder |
| title | varchar | |
| body | text | |
| data | jsonb | Deep link data |
| is_read | boolean | Default false |
| created_at | timestamp | |

---

## 11. ♿ Accessibility and Performance

### Accessibility (WCAG 2.1 AA)

| Feature | Implementation |
|---------|---------------|
| Semantic HTML | Proper heading hierarchy, landmarks, roles |
| Screen Reader | accessibilityLabel on all interactive elements |
| Color Contrast | All text 4.5:1 ratio minimum (verified with palette) |
| Touch Targets | Minimum 44x44pt on all buttons |
| Focus Order | Logical tab order, focus trap on modals |
| Text Scaling | Support up to 200% without layout break |
| Reduced Motion | useReducedMotion() disables animations |
| Color Blind | Never rely on color alone (icons + text always paired) |
| Announcements | Live regions for cart updates and toasts |

### Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| App Size | Under 25MB | Optimize assets, lazy load |
| Time to Interactive | Under 2s | Splash to home quick load |
| First Content Paint | Under 1.5s | Server components, streaming |
| Image Load | BlurHash + progressive | WebP/AVIF, CDN |
| API Response | Under 200ms | Redis cache, DB indexing |
| List Scroll | 60fps | FlashList, window rendering |
| Animation FPS | 60fps | Worklet thread (Reanimated) |
| Bundle Split | Route-based | Dynamic imports |
| Memory | Under 200MB | Image recycling, list virtualization |

### Image Optimization Strategy

- **Format**: AVIF (primary) > WebP > JPEG (fallback)
- **CDN**: Cloudflare Images (auto-transform)
- **Lazy Load**: IntersectionObserver + BlurHash placeholder
- **Responsive**: srcset with 1x, 2x, 3x variants
- **Thumbnails**: 200x200, compressed quality 70
- **Product Images**: 800x800, compressed quality 80
- **Zoom Images**: Full-res 2000x2000 loaded on demand
- **Cache**: HTTP Cache-Control, 30-day immutable

---

## 12. 📁 Full File Structure

SpiceCart/ ├── apps/ │ ├── mobile/ # React Native (Expo) │ │ ├── app/ # Expo Router (file-based routing) │ │ │ ├── _layout.tsx # Root layout (providers, theme) │ │ │ ├── index.tsx # Splash → Onboarding redirect │ │ │ ├── (auth)/ │ │ │ │ ├── _layout.tsx # Auth stack layout │ │ │ │ ├── login.tsx │ │ │ │ ├── signup.tsx │ │ │ │ ├── otp-verify.tsx │ │ │ │ └── forgot-password.tsx │ │ │ ├── (tabs)/ │ │ │ │ ├── _layout.tsx # Bottom tab navigation │ │ │ │ ├── index.tsx # Home screen │ │ │ │ ├── explore.tsx # Explore/Search │ │ │ │ ├── cart.tsx │ │ │ │ ├── wishlist.tsx │ │ │ │ └── profile.tsx │ │ │ ├── product/ │ │ │ │ └── [id].tsx # Product detail (dynamic) │ │ │ ├── category/ │ │ │ │ └── [slug].tsx # Category listing │ │ │ ├── checkout/ │ │ │ │ ├── index.tsx │ │ │ │ ├── payment.tsx │ │ │ │ └── success.tsx │ │ │ ├── order/ │ │ │ │ ├── index.tsx # Order list │ │ │ │ └── [id].tsx # Order detail + tracking │ │ │ ├── recipe/ │ │ │ │ └── [slug].tsx # Recipe detail │ │ │ ├── search.tsx │ │ │ └── notifications.tsx │ │ │ │ │ ├── components/ │ │ │ ├── ui/ # Primitive UI components │ │ │ │ ├── Button.tsx │ │ │ │ ├── Input.tsx │ │ │ │ ├── Card.tsx │ │ │ │ ├── Badge.tsx │ │ │ │ ├── Chip.tsx │ │ │ │ ├── Avatar.tsx │ │ │ │ ├── BottomSheet.tsx │ │ │ │ ├── Toast.tsx │ │ │ │ ├── Modal.tsx │ │ │ │ ├── Skeleton.tsx │ │ │ │ ├── Stepper.tsx │ │ │ │ ├── Switch.tsx │ │ │ │ └── Divider.tsx │ │ │ │ │ │ │ ├── spice/ # Domain-specific components │ │ │ │ ├── SpiceProductCard.tsx │ │ │ │ ├── SpiceCategoryCard.tsx │ │ │ │ ├── SpiceHeatMeter.tsx │ │ │ │ ├── SpicePriceTag.tsx │ │ │ │ ├── SpiceRatingBar.tsx │ │ │ │ ├── SpiceCountdownTimer.tsx │ │ │ │ ├── SpiceCouponInput.tsx │ │ │ │ ├── SpiceSearchBar.tsx │ │ │ │ ├── SpiceTrustBadge.tsx │ │ │ │ ├── SpiceEmptyState.tsx │ │ │ │ ├── SpiceShimmerLoader.tsx │ │ │ │ ├── SpiceCarousel.tsx │ │ │ │ ├── SpiceStepIndicator.tsx │ │ │ │ ├── SpiceChipFilter.tsx │ │ │ │ ├── SpicePullToRefresh.tsx │ │ │ │ ├── SpiceFloatingCTA.tsx │ │ │ │ └── SpiceMapView.tsx │ │ │ │ │ │ │ ├── layout/ │ │ │ │ ├── ScreenWrapper.tsx │ │ │ │ ├── KeyboardAvoiding.tsx │ │ │ │ └── StickyHeader.tsx │ │ │ │ │ │ │ └── animations/ │ │ │ ├── FlyToCartAnimation.tsx │ │ │ ├── HeartFillAnimation.tsx │ │ │ ├── ConfettiEffect.tsx │ │ │ ├── StaggerFadeIn.tsx │ │ │ ├── NumberSpring.tsx │ │ │ └── SharedElementTransition.tsx │ │ │ │ │ ├── stores/ # Zustand stores │ │ │ ├── authStore.ts │ │ │ ├── cartStore.ts │ │ │ ├── wishlistStore.ts │ │ │ ├── searchStore.ts │ │ │ └── uiStore.ts │ │ │ │ │ ├── hooks/ # Custom hooks │ │ │ ├── useProducts.ts # React Query hooks │ │ │ ├── useCategories.ts │ │ │ ├── useCart.ts │ │ │ ├── useAuth.ts │ │ │ ├── useSearch.ts │ │ │ ├── useDebounce.ts │ │ │ ├── useReducedMotion.ts │ │ │ ├── useTheme.ts │ │ │ └── useHapticFeedback.ts │ │ │ │ │ ├── lib/ │ │ │ ├── api/ # API client │ │ │ │ ├── client.ts # Axios instance + interceptors │ │ │ │ ├── products.ts │ │ │ │ ├── auth.ts │ │ │ │ ├── cart.ts │ │ │ │ ├── orders.ts │ │ │ │ └── user.ts │ │ │ ├── trpc/ │ │ │ │ └── client.ts # tRPC React client │ │ │ ├── algolia/ │ │ │ │ └── searchClient.ts │ │ │ ├── analytics/ │ │ │ │ ├── posthog.ts │ │ │ │ └── events.ts │ │ │ ├── payments/ │ │ │ │ └── razorpay.ts │ │ │ └── utils/ │ │ │ ├── formatCurrency.ts │ │ │ ├── calculateDiscount.ts │ │ │ ├── spiceHeatColor.ts │ │ │ ├── validators.ts │ │ │ └── constants.ts │ │ │ │ │ ├── theme/ │ │ │ ├── colors.ts │ │ │ ├── typography.ts │ │ │ ├── spacing.ts │ │ │ ├── shadows.ts │ │ │ └── index.ts │ │ │ │ │ ├── assets/ │ │ │ ├── lottie/ │ │ │ │ ├── splash_spice.json │ │ │ │ ├── empty_jar.json │ │ │ │ ├── jar_pour.json │ │ │ │ ├── spice_confetti.json │ │ │ │ ├── cooking_pot.json │ │ │ │ └── success_check.json │ │ │ ├── rive/ │ │ │ │ ├── spice_mascot.riv │ │ │ │ └── heat_meter.riv │ │ │ ├── images/ # Static images │ │ │ └── fonts/ # Custom fonts │ │ │ │ │ ├── app.json │ │ ├── eas.json │ │ ├── tsconfig.json │ │ ├── babel.config.js │ │ ├── metro.config.js │ │ └── package.json │ │ │ ├── web/ # Next.js 14 Web App │ │ ├── app/ │ │ │ ├── layout.tsx │ │ │ ├── page.tsx # Home │ │ │ ├── products/ │ │ │ │ ├── page.tsx # Listing │ │ │ │ └── [id]/page.tsx # Detail │ │ │ ├── cart/ │ │ │ ├── checkout/ │ │ │ ├── account/ │ │ │ └── api/ # Route handlers │ │ ├── components/ # Shared + web-specific │ │ ├── lib/ │ │ └── package.json │ │ │ └── admin/ # Admin Dashboard │ ├── src/ │ │ ├── pages/ │ │ │ ├── Dashboard.tsx │ │ │ ├── Products.tsx │ │ │ ├── Orders.tsx │ │ │ ├── Customers.tsx │ │ │ ├── Coupons.tsx │ │ │ ├── Analytics.tsx │ │ │ └── Settings.tsx │ │ ├── components/ │ │ └── lib/ │ └── package.json │ ├── packages/ │ ├── shared/ # Monorepo shared code │ │ ├── types/ # TypeScript types │ │ │ ├── product.ts │ │ │ ├── cart.ts │ │ │ ├── order.ts │ │ │ ├── user.ts │ │ │ └── index.ts │ │ ├── validators/ # Zod schemas (shared) │ │ │ ├── product.ts │ │ │ ├── auth.ts │ │ │ └── checkout.ts │ │ ├── constants/ # Shared constants │ │ │ ├── categories.ts │ │ │ ├── countries.ts │ │ │ └── currencies.ts │ │ └── utils/ # Shared utilities │ │ ├── format.ts │ │ ├── date.ts │ │ └── math.ts │ │ │ └── ui/ # Shared UI primitives │ ├── src/ │ │ ├── Button.tsx │ │ ├── Input.tsx │ │ ├── Badge.tsx │ │ └── index.ts │ └── package.json │ ├── server/ # Backend │ ├── src/ │ │ ├── index.ts # Entry point │ │ ├── config/ │ │ │ ├── env.ts │ │ │ ├── database.ts │ │ │ └── redis.ts │ │ ├── db/ │ │ │ ├── schema/ # Drizzle schema │ │ │ │ ├── users.ts │ │ │ │ ├── products.ts │ │ │ │ ├── orders.ts │ │ │ │ ├── carts.ts │ │ │ │ ├── reviews.ts │ │ │ │ └── index.ts │ │ │ ├── migrations/ │ │ │ └── seed.ts │ │ │ │ │ ├── trpc/ │ │ │ ├── router.ts # Root router │ │ │ ├── context.ts # tRPC context │ │ │ └── routers/ │ │ │ ├── auth.ts │ │ │ ├── products.ts │ │ │ ├── cart.ts │ │ │ ├── orders.ts │ │ │ ├── reviews.ts │ │ │ ├── wishlist.ts │ │ │ ├── search.ts │ │ │ └── admin.ts │ │ │ │ │ ├── rest/ │ │ │ ├── routes/ │ │ │ │ ├── webhooks.ts # Razorpay webhook │ │ │ │ └── health.ts │ │ │ └── middleware/ │ │ │ ├── auth.ts │ │ │ ├── rateLimit.ts │ │ │ └── cors.ts │ │ │ │ │ ├── services/ # Business logic │ │ │ ├── authService.ts │ │ │ ├── productService.ts │ │ │ ├── cartService.ts │ │ │ ├── orderService.ts │ │ │ ├── paymentService.ts │ │ │ ├── searchService.ts │ │ │ ├── notificationService.ts │ │ │ └── recommendationService.ts │ │ │ │ │ ├── workers/ # Background jobs │ │ │ ├── orderConfirmation.ts │ │ │ ├── priceAlert.ts │ │ │ ├── abandonedCart.ts │ │ │ ├── reviewReminder.ts │ │ │ └── analyticsAggregator.ts │ │ │ │ │ └── utils/ │ │ ├── couponEngine.ts │ │ ├── stockManager.ts │ │ └── priceCalculator.ts │ │ │ ├── Dockerfile │ ├── docker-compose.yml │ ├── drizzle.config.ts │ ├── tsconfig.json │ └── package.json │ ├── supabase/ # Supabase configuration │ ├── config.toml │ ├── migrations/ # SQL migrations │ └── seed.sql │ ├── turbo/ # Turborepo config │ └── turbo.json │ ├── .github/ │ └── workflows/ │ ├── ci.yml │ ├── deploy-mobile.yml │ ├── deploy-web.yml │ └── deploy-server.yml │ ├── turbo.json # Turborepo pipeline ├── package.json # Monorepo root ├── pnpm-workspace.yaml ├── .env.example ├── .gitignore └── README.md 


---

## 13. 🗓️ Development Roadmap

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Phase 1: Foundation | Week 1-2 | Monorepo setup, design system, auth, navigation skeleton |
| Phase 2: Core Shopping | Week 3-5 | Product catalog, PDP, cart, checkout, basic search |
| Phase 3: Spice Features | Week 6-7 | Heat meter, origin info, recipe pairing, AI recommendations |
| Phase 4: Rich Features | Week 8-9 | Wishlist, reviews, notifications, order tracking, loyalty |
| Phase 5: Admin | Week 10-11 | Admin dashboard, product/order management, analytics |
| Phase 6: Polish | Week 12-13 | Animations, performance, accessibility, dark mode |
| Phase 7: Testing | Week 14-15 | E2E tests, load testing, security audit |
| Phase 8: Launch | Week 16 | App store submission, soft launch, monitoring |

---

## 14. 📊 Key Metrics to Track

| Metric | Tool | Target |
|--------|------|--------|
| DAU/MAU Ratio | PostHog | 40% |
| Conversion Rate | Mixpanel | Above 3.5% |
| Cart Abandonment | Custom Analytics | Below 65% |
| Avg Order Value | Stripe | Rs. 800+ |
| App Crash Rate | Sentry | Below 0.5% |
| App Store Rating | Manual | Above 4.5 stars |
| Search-to-Purchase | PostHog | Above 25% |
| Push Open Rate | Firebase | Above 15% |

---

## 🏁 Summary

SpiceCart is a production-grade, spice-focused e-commerce platform with:

- **10+ fully designed screens** with detailed layouts and wireframes
- **20+ custom spice-themed components** with animation specs
- **20+ micro-interactions** covering every user action
- **10 Lottie + 4 Rive animations** for delight and loading states
- **Full-stack architecture** with React Native, Next.js, Fastify, PostgreSQL
- **Complete database schema** with 14 tables
- **50+ API endpoints** across auth, products, cart, orders, and admin
- **Production-ready tech stack** with CI/CD, monitoring, and caching
- **WCAG 2.1 AA accessible** with performance budgets
- **16-week development roadmap** with clear milestones

The spice-themed design language (heat meters, origin stories, recipe pairings) makes this app uniquely differentiated from generic marketplace clones.

---

*Document Version: 1.0 | Last Updated: 2025*


---

## 15. ⚡ Smooth Working Plan (Performance + Animation Smoothness)

This section upgrades the blueprint into an implementation-ready smoothness plan for React Native + Expo.

### A) Motion Guidelines (60 FPS first)

- Keep critical transitions under **300ms** for taps and **450ms** for screen transitions.
- Use **Reanimated worklets** for transform/opacity animations instead of JS-thread `Animated` when possible.
- Prefer animating **opacity + transform** (`translate`, `scale`) over width/height/position to avoid layout thrash.
- Use `withSpring` for tactile actions (like cart and wishlist), and `withTiming` for deterministic entrance/exit.
- Cap parallel animated elements per screen section (avoid 10+ heavy loops visible at once).

### B) Reduced Jank Strategy

- Defer non-critical work until after navigation transition (e.g., network prefetch, analytics dispatch).
- Use list virtualization everywhere (`FlashList`/optimized `FlatList`) for product and order-heavy screens.
- Memoize cards and row renderers (`React.memo`, stable callbacks, stable keys).
- Pre-size image containers and use lightweight placeholders to prevent content jumps.
- Avoid heavy blur/drop-shadow stacking on low-end Android devices.

### C) Animation Tokens (single source of truth)

Create motion constants to standardize feel across app:

- `motion.fast = 160`
- `motion.normal = 240`
- `motion.slow = 360`
- `spring.snappy = { damping: 16, stiffness: 220 }`
- `spring.gentle = { damping: 20, stiffness: 140 }`

### D) Interaction Micro-Patterns

- **Tap feedback:** scale to `0.97` then return.
- **Card reveal:** fade + translateY 12→0 with 30ms stagger.
- **Add to cart:** fly-to-cart path + counter bump.
- **Wishlist toggle:** heart fill + haptic light impact.
- **Errors:** shake + inline message + no blocking modal unless critical.

### E) Runtime Checks

- Validate smoothness on low-end Android profile with real image-heavy data.
- Track dropped frames for Home, Explore, Product, Cart.
- Keep initial Home Time-to-Interactive under 2.5s on mid-range devices.

---

## 16. 🗂️ File-by-File Implementation Details (Current Repo)

Below is a practical ownership map so teams can improve "smooth working" quickly without ambiguity.

### App Screens (Primary UX surfaces)

- `apps/mobile/app/index.tsx` — entry composition and top-level user flow.
- `apps/mobile/app/(tabs)/index.tsx` — Home feed sections and above-the-fold perceived performance.
- `apps/mobile/app/(tabs)/explore.tsx` — product listing virtualization, filters, and scroll behavior.
- `apps/mobile/app/product/[id].tsx` — media gallery, CTA animations, and related product transitions.
- `apps/mobile/app/(tabs)/cart.tsx` — quantity updates, removal transitions, price recalculation feedback.
- `apps/mobile/app/checkout/index.tsx` — form responsiveness and payment-step continuity.

### Shared UX Components (Animation + visual consistency)

- `apps/mobile/components/spice/SpiceCarousel.tsx` — hero and promo carousel motion quality.
- `apps/mobile/components/spice/ThreeDCarousel.tsx` — advanced swipe interpolation and perspective tuning.
- `apps/mobile/components/spice/SpiceProductCard.tsx` — card press animation, image loading state, wishlist/cart feedback.
- `apps/mobile/components/spice/SpiceShimmerLoader.tsx` — skeleton strategy for perceived speed.
- `packages/ui/src/FlyingCartProvider.tsx` — fly-to-cart orchestration and queueing.
- `packages/ui/src/AnimatedNumber.tsx` — cart totals and dynamic values without jitter.

### State + Data Flow (Smoothness-critical)

- `apps/mobile/stores/useCartStore.ts` — optimistic cart updates and batched writes.
- `apps/mobile/stores/useUIStore.ts` — global UI flags (modals, loading, toasts) and flicker prevention.
- `apps/mobile/hooks/useProducts.ts` — pagination, prefetching, and cache hydration strategy.
- `apps/mobile/hooks/useReducedMotion.ts` — accessibility-compliant motion scaling.

### Media / Motion Assets

- `assets/lottie/*.json` — keep Lottie sizes optimized; avoid extremely high layer counts.
- `assets/images/*` — compress and serve device-appropriate dimensions.

### Engineering Standards for Smoothness

- Use a **single animation utility module** for timing/spring tokens.
- Add performance checklist to PR template for all UI-heavy changes.
- Every new list screen must include virtualization + placeholder skeletons.
- Every new motion pattern must define reduced-motion behavior.

