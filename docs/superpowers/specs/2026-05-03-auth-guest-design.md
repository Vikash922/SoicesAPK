# Design Spec: SpiceCart Authentication & Guest Experience

**Date:** 2026-05-03
**Status:** Draft

## 1. Overview
Implementation of the authentication system and "Browse-First" guest experience for SpiceCart. This phase covers the transition from Onboarding to either Guest browsing or Secure Login/Signup.

## 2. Architecture & Flow
- **Entry Point:** Onboarding Slide 3 "GET STARTED" or "SKIP".
- **Decision Logic:** 
  - If "SKIP" or "Continue as Guest" selected -> Redirect to `(tabs)`.
  - If "GET STARTED" -> Redirect to `(auth)/login`.
- **Guest State:**
  - Users can browse the catalog, view products, and see categories.
  - Restricted Actions: "Add to Cart", "Add to Wishlist", and "Checkout" will trigger a login modal/redirect.

## 3. Screen Designs

### Screen 3: Login / Signup
- **Background:** Animated amber waves using `react-native-reanimated`.
- **Header:** Back arrow + SpiceCart Logo.
- **Inputs:**
  - Phone Number: Manual country code input + number field.
  - Password: Secure entry with toggle visibility.
- **Actions:**
  - Primary: "LOGIN" (Saffron Gold).
  - Secondary: Social Login Row (Google, Phone OTP, Apple).
- **Footer:** "New here? Sign Up" and "Continue as Guest".

### Authentication Logic (Firebase Integration)
- Implement Firebase Auth handlers in `store/useAuthStore.ts`.
- Support Email/Password and Phone OTP.
- Placeholder integration for Google/Apple OAuth (UI components + logic hooks).

## 4. Components to Build/Update
- `LoginScreen`: Main entry for auth.
- `SignupScreen`: Account creation.
- `AuthTextField`: Specialized input with focus animations.
- `SocialLoginButton`: Reusable icon button for Google/Apple.
- `AnimatedBackground`: The Reanimated amber wave component.

## 5. Success Criteria
- Smooth transition from onboarding to home (as guest).
- Functional login/signup with Firebase validation.
- Consistent visual language (Saffron Gold, Dark/Cream themes).
