/**
 * Tilt level data for local synchronization (Offline mode)
 * Synced between components via LocalBroadcastService
 */
export interface LocalReading {
  /** Pitch angle (forward/backward tilt) in degrees */
  pitch: number;

  /** Roll angle (left/right tilt) in degrees */
  roll: number;

  /** UNIX timestamp of data update in milliseconds */
  updatedAt: number;
}

