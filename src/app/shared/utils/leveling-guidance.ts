import { LevelStatus, SeverityLevel } from '../models/level-status.model';
import { WheelHeight } from '../models/wheel-height.model';
import { LEVELING_THRESHOLDS } from '../constants/thresholds';

const { LIFT_THRESHOLD, LEVEL_THRESHOLD, ORANGE_THRESHOLD } = LEVELING_THRESHOLDS;

export function buildWheelHeights(pitch: number, roll: number): WheelHeight[] {
  const wheels: WheelHeight[] = [
    { label: 'Front Left', lift: -pitch - roll, isHighest: false },
    { label: 'Front Right', lift: -pitch + roll, isHighest: false },
    { label: 'Rear Left', lift: pitch - roll, isHighest: false },
    { label: 'Rear Right', lift: pitch + roll, isHighest: false }
  ];

  const wheelsToLift = wheels.filter((wheel) => wheel.lift > LIFT_THRESHOLD);
  const maxPositiveLift = wheelsToLift.length > 0 ? Math.max(...wheelsToLift.map((wheel) => wheel.lift)) : 0;

  return wheels.map((wheel) => ({
    ...wheel,
    isHighest: wheel.lift > LIFT_THRESHOLD && wheel.lift === maxPositiveLift && maxPositiveLift > LEVEL_THRESHOLD
  }));
}

export function isLeveledApproximately(pitch: number, roll: number): boolean {
  return Math.abs(pitch) < LEVEL_THRESHOLD && Math.abs(roll) < LEVEL_THRESHOLD;
}

export function calculateLevelStatus(pitch: number, roll: number, wheels: WheelHeight[]): LevelStatus {
  const maxTilt = Math.max(Math.abs(pitch), Math.abs(roll));

  const wheelsToLift = wheels
    .filter((wheel) => wheel.lift > LIFT_THRESHOLD)
    .sort((a, b) => b.lift - a.lift)
    .map((wheel) => wheel.label);

  const severity = getSeverity(maxTilt);
  let message = getDefaultMessage(severity);

  const primaryWheel = wheelsToLift[0] || null;
  if (primaryWheel) {
    message = `Start with: ${primaryWheel}${wheelsToLift.length > 1 ? ` then ${wheelsToLift.slice(1).join(', ')}` : ''}`;
  }

  return {
    severity,
    message,
    wheelsToLift,
    primaryWheel
  };
}

function getSeverity(maxTilt: number): SeverityLevel {
  if (maxTilt < LEVEL_THRESHOLD) {
    return 'green';
  }

  if (maxTilt < ORANGE_THRESHOLD) {
    return 'orange';
  }

  return 'red';
}

function getDefaultMessage(severity: SeverityLevel): string {
  if (severity === 'green') {
    return '✅ The camper is level!';
  }

  if (severity === 'orange') {
    return '⚠️ Slight tilt - minor adjustments needed';
  }

  return '🔴 Significant tilt - needs attention';
}

