/**
 * Threshold values for tilt calculation
 */
export const LEVELING_THRESHOLDS = {
  /** Minimum tilt at which wheel is considered raised (in degrees) */
  LIFT_THRESHOLD: 0.3,

  /** Threshold for determining level as "straight" (in degrees) */
  LEVEL_THRESHOLD: 0.5,

  /** Threshold for determining critical tilt (in degrees) */
  ORANGE_THRESHOLD: 2
} as const;

/**
 * Default synchronization intervals (in milliseconds)
 */
export const SYNC_INTERVALS = {
  /** Standard data sync interval */
  DEFAULT_SYNC_INTERVAL: 1000,

  /** Minimum allowed interval */
  MIN_SYNC_INTERVAL: 100,

  /** Maximum allowed interval */
  MAX_SYNC_INTERVAL: 10000
} as const;

/**
 * Send thresholds (in degrees)
 */
export const SEND_THRESHOLDS = {
  /** Tilt change must exceed this value to send new data */
  DEFAULT_SEND_THRESHOLD: 0.5,

  /** Send even with minimal changes */
  AGGRESSIVE_SEND_THRESHOLD: 0,

  /** Send only on significant changes */
  CONSERVATIVE_SEND_THRESHOLD: 2
} as const;

