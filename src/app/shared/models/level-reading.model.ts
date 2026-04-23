/**
 * Camper/trailer tilt level data
 * Transmitted between sender and receiver via Firebase
 */
export interface LevelReading {
  /** Pitch angle (forward/backward tilt) in degrees */
  pitch: number;

  /** Roll angle (left/right tilt) in degrees */
  roll: number;

  /** UNIX timestamp of data update in milliseconds */
  updatedAt: number;
}

