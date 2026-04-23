/**
 * Wheel height information
 * Used for visualization and leveling recommendations
 */
export interface WheelHeight {
  /** Wheel name (Front Left, Front Right, Rear Left, Rear Right) */
  label: string;

  /** Wheel lift height in relative units (can be negative) */
  lift: number;

  /** Whether this wheel is the highest among raised ones */
  isHighest: boolean;
}

