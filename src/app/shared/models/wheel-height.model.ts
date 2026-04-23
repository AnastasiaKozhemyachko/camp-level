/**
 * Wheel height information
 * Used for visualization and leveling recommendations
 */
export interface WheelHeight {
  /** Wheel name (Front Left, Front Right, Rear Left, Rear Right) */
  label: string;

  /** Required lift command in meters (positive-only) */
  lift: number;

  /** Required lift command in centimeters (positive-only) */
  liftCm: number;

  /** Relative wheel tilt in degrees using legacy pitch/roll mapping */
  tiltDeg: number;

  /** Whether this wheel is the highest among raised ones */
  isHighest: boolean;
}

