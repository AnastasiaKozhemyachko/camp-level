/**
 * Tilt severity level
 * green: level within normal range
 * orange: slight tilt, minor corrections needed
 * red: significant tilt, requires attention
 */
export type SeverityLevel = 'green' | 'orange' | 'red';

/**
 * Leveling status with correction recommendations
 */
export interface LevelStatus {
  /** Tilt severity level */
  severity: SeverityLevel;

  /** Message with recommendation for user */
  message: string;

  /** List of wheels to lift (sorted by lift degree) */
  wheelsToLift: string[];

  /** First wheel from the list to lift, or null if level */
  primaryWheel: string | null;
}

