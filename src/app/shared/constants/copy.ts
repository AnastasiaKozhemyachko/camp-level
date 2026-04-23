export const COPY = {
  common: {
    unknownError: 'Unknown error.'
  },
  sender: {
    unsupported: 'Device orientation is not supported on this device.',
    waiting: 'Waiting for permission to start the sensor.',
    running: 'Tracking live device orientation...',
    startError: 'Unable to start motion tracking.',
    stopped: 'Tracking stopped. You can start again.',
    syncError: 'Tracking, but the last sync failed.',
    motionStopped: 'Motion tracking stopped.'
  },
  offlineSender: {
    running: 'Tracking and sending local updates...',
    syncError: 'Tracking, but local sync failed.'
  },
  receiver: {
    waiting: 'Waiting for data...',
    waitingForFirstSync: 'No data yet.',
    waitingGuidance: 'Open Sender mode on the other device to begin streaming tilt data.',
    waitingForSenderGuidance: 'Start Sender mode on another device and wait for the first sync.',
    receivingFirestore: 'Receiving live updates from Firestore.',
    receivingLocal: 'Receiving local updates...',
    readError: 'Unable to read Firestore updates.'
  },
  offlineReceiver: {
    waiting: 'Waiting for Sender...',
    waitingGuidance: 'Start Offline Sender to begin local sync.'
  }
} as const;

