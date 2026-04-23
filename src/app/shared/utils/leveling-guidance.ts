import { LevelStatus, SeverityLevel } from '../models/level-status.model';
import { WheelHeight } from '../models/wheel-height.model';
import { AIRBAG_CONFIG, LEVELING_THRESHOLDS } from '../constants/thresholds';

const { LEVEL_THRESHOLD, ORANGE_THRESHOLD } = LEVELING_THRESHOLDS;
const { WHEEL_BASE_M, TRACK_WIDTH_M, MAX_LIFT_M, MAX_ACTIVE_CORNERS } = AIRBAG_CONFIG;
const ZERO_LIFT_M = 1e-6;

function computeRawHeights(pitch: number, roll: number): number[] {
  const frontBackHalf = (WHEEL_BASE_M / 2) * Math.tan((pitch * Math.PI) / 180);
  const leftRightHalf = (TRACK_WIDTH_M / 2) * Math.tan((roll * Math.PI) / 180);
  return [
    -frontBackHalf - leftRightHalf,
    -frontBackHalf + leftRightHalf,
    frontBackHalf - leftRightHalf,
    frontBackHalf + leftRightHalf
  ];
}

export function buildWheelHeights(pitch: number, roll: number): WheelHeight[] {
  const wheels: WheelHeight[] = [
    { label: 'Front Left', lift: 0, liftCm: 0, tiltDeg: 0, isHighest: false },
    { label: 'Front Right', lift: 0, liftCm: 0, tiltDeg: 0, isHighest: false },
    { label: 'Rear Left', lift: 0, liftCm: 0, tiltDeg: 0, isHighest: false },
    { label: 'Rear Right', lift: 0, liftCm: 0, tiltDeg: 0, isHighest: false }
  ];

  if (isLeveledApproximately(pitch, roll)) {
    return wheels;
  }

  const rawHeights = computeRawHeights(pitch, roll);
  const rawTiltDegrees = [
    -pitch - roll,
    -pitch + roll,
    pitch - roll,
    pitch + roll
  ];

  const minRaw = Math.min(...rawHeights);
  const shifted = rawHeights.map((value) => value - minRaw);
  const maxNeededLift = Math.max(...shifted);
  const scale = maxNeededLift > MAX_LIFT_M ? MAX_LIFT_M / maxNeededLift : 1;

  const lifts = shifted.map((value) => {
    const lift = value * scale;
    return lift > ZERO_LIFT_M ? lift : 0;
  });

  const maxLift = Math.max(...lifts);

  return wheels.map((wheel, index) => ({
    ...wheel,
    lift: lifts[index],
    liftCm: +(lifts[index] * 100).toFixed(1),
    tiltDeg: +rawTiltDegrees[index].toFixed(1),
    isHighest: lifts[index] > ZERO_LIFT_M && lifts[index] === maxLift
  }));
}

export function isLeveledApproximately(pitch: number, roll: number): boolean {
  return Math.abs(pitch) < LEVEL_THRESHOLD && Math.abs(roll) < LEVEL_THRESHOLD;
}

export function calculateLevelStatus(pitch: number, roll: number, wheels: WheelHeight[]): LevelStatus {
  const maxTilt = Math.max(Math.abs(pitch), Math.abs(roll));
  const rawHeights = computeRawHeights(pitch, roll);
  const exceededByCm = Math.max(0, (Math.max(...rawHeights) - Math.min(...rawHeights) - MAX_LIFT_M) * 100);
  const feasible = exceededByCm <= 0;

  const wheelsToLift = wheels
    .filter((wheel) => wheel.lift > ZERO_LIFT_M)
    .sort((a, b) => b.lift - a.lift)
    .slice(0, MAX_ACTIVE_CORNERS)
    .map((wheel) => wheel.label);

  const severity = getSeverity(maxTilt);
  let message = getDefaultMessage(severity);

  const primaryWheel = wheelsToLift[0] ?? null;
  if (primaryWheel) {
    const wheelDetails = wheels
      .filter((wheel) => wheelsToLift.includes(wheel.label))
      .sort((a, b) => b.lift - a.lift)
      .map((wheel) => `${wheel.label} (${wheel.liftCm.toFixed(1)} cm, ${Math.abs(wheel.tiltDeg).toFixed(1)}°)`)
      .join(', then ');

    message = `Start with: ${wheelDetails}`;

  } else if (isLeveledApproximately(pitch, roll)) {
    message = `✅ The camper is level (±${LEVEL_THRESHOLD}°).`;
  }

  return {
    severity,
    message,
    wheelsToLift,
    primaryWheel,
    feasible,
    exceededByCm: +exceededByCm.toFixed(1)
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

