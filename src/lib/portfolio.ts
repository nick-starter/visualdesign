export type DeviceMode = 'phone' | 'tablet'

export type ScreenAsset = {
  id: string
  label: string
  phone: string
  tablet: string
}

/** Swap these paths (or replace the SVG files) to use your own case-study screens. */
export const SCREEN_ASSETS: ScreenAsset[] = [
  {
    id: 'atlas',
    label: 'Atlas Focus',
    phone: './screens/phone-atlas.svg',
    tablet: './screens/tablet-atlas.svg',
  },
  {
    id: 'meridian',
    label: 'Meridian Trails',
    phone: './screens/phone-meridian.svg',
    tablet: './screens/tablet-atlas.svg',
  },
]

export const DEVICE = {
  phone: {
    width: 0.72,
    height: 1.52,
    depth: 0.09,
    radius: 0.09,
    bezel: 0.028,
  },
  tablet: {
    width: 1.14,
    height: 1.52,
    depth: 0.07,
    radius: 0.07,
    bezel: 0.034,
  },
} as const

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
