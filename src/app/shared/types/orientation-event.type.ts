export type OrientationPermission = 'granted' | 'denied';

export type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<OrientationPermission>;
};

