/**
 * Current device orientation readings
 * Obtained from DeviceOrientationEvent
 */
export interface OrientationReading {
  /** Pitch angle (forward/backward tilt) in degrees */
  pitch: number;

  /** Roll angle (left/right tilt) in degrees */
  roll: number;
}

