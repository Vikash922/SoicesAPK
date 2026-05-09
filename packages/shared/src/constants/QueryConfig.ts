/**
 * React Query Cache Strategy
 * Centralized stale times for different data types as defined in Gemini.md
 */

export const STALE_TIMES = {
  CATEGORIES: 1000 * 60 * 30,    // 30 minutes
  PRODUCTS: 1000 * 60 * 5,       // 5 minutes
  SEARCH_RESULTS: 1000 * 60 * 2, // 2 minutes
  CART: 1000 * 30,               // 30 seconds
  USER_PROFILE: 1000 * 60 * 10,  // 10 minutes
  ORDERS: 1000 * 60 * 5,         // 5 minutes
  REVIEWS: 1000 * 60 * 15,       // 15 minutes
  RECOMMENDATIONS: 1000 * 60 * 10, // 10 minutes
  FLASH_DEALS: 1000 * 10,        // 10 seconds
} as const;
