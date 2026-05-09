export const motion = {
  fast: 160,
  normal: 240,
  slow: 360,
  stagger: 30,
} as const;

export const spring = {
  snappy: { damping: 16, stiffness: 220 },
  gentle: { damping: 20, stiffness: 140 },
} as const;

