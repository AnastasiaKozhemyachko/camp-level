import { LevelReading } from '../../../shared/models/level-reading.model';
import { Observable } from 'rxjs';

/**
 * Configuration for SenderRuntimeService
 * Defines behavior of orientation data sending
 */
export interface SenderRuntimeConfig {
  /** Data sync interval in milliseconds */
  syncIntervalMs: number;

  /** Minimum tilt change in degrees to send new data */
  sendThreshold: number;

  /** Message when device is not supported */
  unsupportedMessage: string;

  /** Message when waiting for permission */
  waitingMessage: string;

  /** Message during active tracking */
  runningMessage: string;

  /** Message on start error */
  startErrorMessage: string;

  /** Message after tracking stopped */
  stoppedMessage: string;

  /** Message on sync error */
  syncErrorMessage: string;

  /** Function to save orientation data */
  writeReading: (reading: LevelReading) => Observable<void>;
}

