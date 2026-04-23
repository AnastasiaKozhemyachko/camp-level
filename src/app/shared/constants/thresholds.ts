/**
 * Threshold values for tilt calculation
 */
export const LEVELING_THRESHOLDS = {
  /** Minimum tilt at which wheel is considered raised (in degrees) */
  LIFT_THRESHOLD: 0.3,

  /** Threshold for determining level as "straight" (in degrees) */
  LEVEL_THRESHOLD: 0.3,

  /** Threshold for determining critical tilt (in degrees) */
  ORANGE_THRESHOLD: 2
} as const;

/**
 * Vehicle and suspension configuration used for corner lift calculations
 */
export const AIRBAG_CONFIG = {
  /** Distance between front and rear axle (meters) */
  WHEEL_BASE_M: 3,

  /** Distance between left and right wheels (meters) */
  TRACK_WIDTH_M: 1.628,

  /** Maximum lift per airbag/corner (meters) */
  MAX_LIFT_M: 0.18,

  /** Maximum number of corners to lift at the same time */
  MAX_ACTIVE_CORNERS: 2
} as const;

/**
 * Maximum tilt angles compensatable within airbag lift limits.
 * Derived from AIRBAG_CONFIG geometry — single source of truth.
 */
export const AIRBAG_MAX_ANGLES = {
  /** Max pitch (front-back) angle fully compensatable by airbags (degrees) */
  PITCH_DEG: +(Math.atan(AIRBAG_CONFIG.MAX_LIFT_M / AIRBAG_CONFIG.WHEEL_BASE_M) * 180 / Math.PI).toFixed(1),

  /** Max roll (left-right) angle fully compensatable by airbags (degrees) */
  ROLL_DEG: +(Math.atan(AIRBAG_CONFIG.MAX_LIFT_M / AIRBAG_CONFIG.TRACK_WIDTH_M) * 180 / Math.PI).toFixed(1),

  /** Slider range margin: 1° beyond physical max to allow infeasible zone */
  SLIDER_MARGIN_DEG: 1
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

