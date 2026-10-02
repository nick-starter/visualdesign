import * as THREE from 'three'

export type DeviceMode = 'phone' | 'tablet'

export type ScreenAsset = {
  id: string
  label: string
  /** Optional image overrides. Leave empty to use built-in canvas mockups. */
  phone?: string
  tablet?: string
  paintPhone: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
  paintTablet: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function paintAtlasPhone(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#0F1614')
  g.addColorStop(1, '#18211C')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  fillRoundRect(ctx, 24, 28, 42, 42, 14)
  ctx.fillStyle = '#C8F07A'
  ctx.fill()

  ctx.fillStyle = '#F4F7F2'
  ctx.font = '600 15px Manrope, system-ui, sans-serif'
  ctx.fillText('Atlas', 78, 48)
  ctx.fillStyle = '#8FA396'
  ctx.font = '400 11px Manrope, system-ui, sans-serif'
  ctx.fillText('Morning focus', 78, 66)

  ctx.beginPath()
  ctx.arc(342, 49, 16, 0, Math.PI * 2)
  ctx.fillStyle = '#24302A'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(342, 49, 7, 0, Math.PI * 2)
  ctx.fillStyle = '#C8F07A'
  ctx.fill()

  ctx.fillStyle = '#F4F7F2'
  ctx.font = '700 34px Syne, system-ui, sans-serif'
  ctx.fillText("Today's plan", 24, 118)
  ctx.fillStyle = '#8FA396'
  ctx.font = '400 14px Manrope, system-ui, sans-serif'
  ctx.fillText('3 sessions · 2h 10m reserved', 24, 148)

  const hero = ctx.createLinearGradient(24, 178, 366, 346)
  hero.addColorStop(0, '#2A4A3A')
  hero.addColorStop(1, '#1A2E28')
  fillRoundRect(ctx, 24, 178, 342, 168, 28)
  ctx.fillStyle = hero
  ctx.fill()

  ctx.fillStyle = '#C8F07A'
  ctx.font = '600 12px Manrope, system-ui, sans-serif'
  ctx.fillText('DEEP WORK', 48, 228)
  ctx.fillStyle = '#F4F7F2'
  ctx.font = '700 28px Syne, system-ui, sans-serif'
  ctx.fillText('Brand systems', 48, 262)
  ctx.fillStyle = '#B7C8BC'
  ctx.font = '400 14px Manrope, system-ui, sans-serif'
  ctx.fillText('09:30 — 11:00 · Studio east', 48, 292)

  fillRoundRect(ctx, 48, 310, 96, 18, 9)
  ctx.fillStyle = 'rgba(200,240,122,0.18)'
  ctx.fill()
  ctx.fillStyle = '#C8F07A'
  ctx.font = '600 11px Manrope, system-ui, sans-serif'
  ctx.fillText('In progress', 60, 323)

  ctx.fillStyle = '#F4F7F2'
  ctx.font = '600 18px Syne, system-ui, sans-serif'
  ctx.fillText('Up next', 24, 398)

  const rows = [
    { y: 420, title: 'Client review', meta: '12:30 · Loom + notes', time: '45m', accent: '#C8F07A', chip: '#3D5C4A' },
    { y: 524, title: 'Motion pass', meta: '15:00 · Prototype polish', time: '90m', accent: '#E8C27A', chip: '#4A3D2A' },
  ]
  for (const row of rows) {
    fillRoundRect(ctx, 24, row.y, 342, 88, 22)
    ctx.fillStyle = '#1A2420'
    ctx.fill()
    fillRoundRect(ctx, 40, row.y + 20, 48, 48, 14)
    ctx.fillStyle = row.chip
    ctx.fill()
    ctx.fillStyle = '#F4F7F2'
    ctx.font = '600 15px Manrope, system-ui, sans-serif'
    ctx.fillText(row.title, 104, row.y + 40)
    ctx.fillStyle = '#8FA396'
    ctx.font = '400 12px Manrope, system-ui, sans-serif'
    ctx.fillText(row.meta, 104, row.y + 62)
    ctx.fillStyle = row.accent
    ctx.font = '600 12px Manrope, system-ui, sans-serif'
    ctx.fillText(row.time, 320, row.y + 48)
  }

  fillRoundRect(ctx, 24, 640, 162, 110, 24)
  ctx.fillStyle = '#1A2420'
  ctx.fill()
  ctx.fillStyle = '#8FA396'
  ctx.font = '400 12px Manrope, system-ui, sans-serif'
  ctx.fillText('Focus score', 44, 680)
  ctx.fillStyle = '#F4F7F2'
  ctx.font = '700 32px Syne, system-ui, sans-serif'
  ctx.fillText('92', 44, 716)

  fillRoundRect(ctx, 204, 640, 162, 110, 24)
  ctx.fillStyle = '#1A2420'
  ctx.fill()
  ctx.fillStyle = '#8FA396'
  ctx.font = '400 12px Manrope, system-ui, sans-serif'
  ctx.fillText('Streak', 224, 680)
  ctx.fillStyle = '#F4F7F2'
  ctx.font = '700 32px Syne, system-ui, sans-serif'
  ctx.fillText('18d', 224, 716)

  fillRoundRect(ctx, 48, 780, 294, 4, 2)
  ctx.fillStyle = '#2A3630'
  ctx.fill()
}

function paintAtlasTablet(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#0E1412')
  g.addColorStop(1, '#161E1A')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#8FA396'
  ctx.font = '600 14px Manrope, system-ui, sans-serif'
  ctx.fillText('ATLAS DESKTOP', 40, 64)
  ctx.fillStyle = '#F4F7F2'
  ctx.font = '700 42px Syne, system-ui, sans-serif'
  ctx.fillText('Workspace overview', 40, 110)
  ctx.fillStyle = '#8FA396'
  ctx.font = '400 16px Manrope, system-ui, sans-serif'
  ctx.fillText('Week of Mar 16 · 4 active projects', 40, 146)

  fillRoundRect(ctx, 520, 72, 96, 40, 20)
  ctx.fillStyle = '#24302A'
  ctx.fill()
  ctx.fillStyle = '#C8F07A'
  ctx.font = '600 13px Manrope, system-ui, sans-serif'
  ctx.fillText('Filter', 548, 97)

  fillRoundRect(ctx, 628, 72, 100, 40, 20)
  ctx.fillStyle = '#C8F07A'
  ctx.fill()
  ctx.fillStyle = '#0B1210'
  ctx.font = '700 13px Manrope, system-ui, sans-serif'
  ctx.fillText('New task', 648, 97)

  const card = ctx.createLinearGradient(40, 188, 370, 448)
  card.addColorStop(0, '#254436')
  card.addColorStop(1, '#1A2E28')
  fillRoundRect(ctx, 40, 188, 330, 260, 32)
  ctx.fillStyle = card
  ctx.fill()
  ctx.fillStyle = '#C8F07A'
  ctx.font = '600 13px Manrope, system-ui, sans-serif'
  ctx.fillText('PRIMARY', 68, 240)
  ctx.fillStyle = '#F4F7F2'
  ctx.font = '700 30px Syne, system-ui, sans-serif'
  ctx.fillText('Brand systems', 68, 288)
  ctx.fillStyle = '#B7C8BC'
  ctx.font = '400 15px Manrope, system-ui, sans-serif'
  ctx.fillText('Token audit · component map', 68, 324)
  fillRoundRect(ctx, 68, 360, 180, 10, 5)
  ctx.fillStyle = '#1A2420'
  ctx.fill()
  fillRoundRect(ctx, 68, 360, 126, 10, 5)
  ctx.fillStyle = '#C8F07A'
  ctx.fill()
  ctx.fillStyle = '#8FA396'
  ctx.font = '400 13px Manrope, system-ui, sans-serif'
  ctx.fillText('70% complete', 68, 400)

  fillRoundRect(ctx, 398, 188, 330, 120, 28)
  ctx.fillStyle = '#1A2420'
  ctx.fill()
  ctx.fillStyle = '#8FA396'
  ctx.font = '400 13px Manrope, system-ui, sans-serif'
  ctx.fillText('Team load', 426, 236)
  ctx.fillStyle = '#F4F7F2'
  ctx.font = '700 36px Syne, system-ui, sans-serif'
  ctx.fillText('68%', 426, 278)

  fillRoundRect(ctx, 398, 328, 158, 120, 28)
  ctx.fillStyle = '#1A2420'
  ctx.fill()
  ctx.fillStyle = '#8FA396'
  ctx.font = '400 13px Manrope, system-ui, sans-serif'
  ctx.fillText('Shipped', 422, 376)
  ctx.fillStyle = '#F4F7F2'
  ctx.font = '700 32px Syne, system-ui, sans-serif'
  ctx.fillText('12', 422, 416)

  fillRoundRect(ctx, 570, 328, 158, 120, 28)
  ctx.fillStyle = '#1A2420'
  ctx.fill()
  ctx.fillStyle = '#8FA396'
  ctx.font = '400 13px Manrope, system-ui, sans-serif'
  ctx.fillText('Blocked', 594, 376)
  ctx.fillStyle = '#E8C27A'
  ctx.font = '700 32px Syne, system-ui, sans-serif'
  ctx.fillText('2', 594, 416)

  ctx.fillStyle = '#F4F7F2'
  ctx.font = '600 22px Syne, system-ui, sans-serif'
  ctx.fillText('Board', 40, 510)

  const columns = [
    {
      x: 40,
      title: 'BACKLOG',
      color: '#8FA396',
      cards: [
        ['Icon set v2', 'Design · 3h'],
        ['Onboarding copy', 'Content · 2h'],
      ],
    },
    {
      x: 280,
      title: 'IN PROGRESS',
      color: '#C8F07A',
      cards: [
        ['Brand systems', 'Design · Due today'],
        ['Motion pass', 'Prototype · 90m'],
      ],
    },
    {
      x: 520,
      title: 'REVIEW',
      color: '#8FA396',
      cards: [
        ['Client review', '12:30 today'],
        ['Nav study', 'Waiting on eng'],
      ],
    },
  ]

  for (const col of columns) {
    const colW = col.x === 520 ? 208 : 220
    fillRoundRect(ctx, col.x, 540, colW, 360, 24)
    ctx.fillStyle = '#1A2420'
    ctx.fill()
    ctx.fillStyle = col.color
    ctx.font = '600 13px Manrope, system-ui, sans-serif'
    ctx.fillText(col.title, col.x + 24, 580)
    col.cards.forEach((cardItem, i) => {
      const y = 608 + i * 88
      fillRoundRect(ctx, col.x + 24, y, colW - 48, i === 0 && col.title === 'IN PROGRESS' ? 88 : 72, 16)
      ctx.fillStyle = i === 0 && col.title === 'IN PROGRESS' ? '#254436' : '#24302A'
      ctx.fill()
      ctx.fillStyle = '#F4F7F2'
      ctx.font = '600 14px Manrope, system-ui, sans-serif'
      ctx.fillText(cardItem[0], col.x + 40, y + 32)
      ctx.fillStyle = '#8FA396'
      ctx.font = '400 12px Manrope, system-ui, sans-serif'
      ctx.fillText(cardItem[1], col.x + 40, y + 54)
    })
  }
}

function paintMeridianPhone(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#10141A')
  g.addColorStop(1, '#171C24')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#9AA7B8'
  ctx.font = '600 13px Manrope, system-ui, sans-serif'
  ctx.fillText('MERIDIAN', 24, 56)
  ctx.fillStyle = '#F2F5F8'
  ctx.font = '700 36px Syne, system-ui, sans-serif'
  ctx.fillText('North Shore', 24, 108)
  ctx.fillStyle = '#9AA7B8'
  ctx.font = '400 14px Manrope, system-ui, sans-serif'
  ctx.fillText('Weekend itinerary · 3 stops', 24, 140)

  fillRoundRect(ctx, 24, 178, 342, 220, 28)
  ctx.fillStyle = '#243044'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(120, 270, 48, 0, Math.PI * 2)
  ctx.fillStyle = '#3A5168'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(200, 250, 64, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(74,102,128,0.7)'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(270, 290, 40, 0, Math.PI * 2)
  ctx.fillStyle = '#2E4258'
  ctx.fill()
  ctx.fillStyle = '#F2F5F8'
  ctx.font = '600 18px Syne, system-ui, sans-serif'
  ctx.fillText('Coastal loop', 48, 360)
  ctx.fillStyle = '#9AA7B8'
  ctx.font = '400 13px Manrope, system-ui, sans-serif'
  ctx.fillText('12.4 km · Moderate', 48, 384)

  const stops = [
    ['1 · Harbor overlook', 'Arrive 09:15 · 40 min'],
    ['2 · Cedar trail', 'Arrive 10:20 · 1h 15m'],
    ['3 · Tide pool bay', 'Arrive 12:00 · Sunset stay'],
  ]
  stops.forEach((stop, i) => {
    const y = 430 + i * 112
    fillRoundRect(ctx, 24, y, 342, 96, 22)
    ctx.fillStyle = '#1C232E'
    ctx.fill()
    ctx.fillStyle = '#F2F5F8'
    ctx.font = '600 16px Manrope, system-ui, sans-serif'
    ctx.fillText(stop[0], 48, y + 40)
    ctx.fillStyle = '#9AA7B8'
    ctx.font = '400 13px Manrope, system-ui, sans-serif'
    ctx.fillText(stop[1], 48, y + 66)
  })

  fillRoundRect(ctx, 48, 790, 294, 4, 2)
  ctx.fillStyle = '#2A3340'
  ctx.fill()
}

/** Built-in mockups. Replace by setting phone/tablet image paths, or edit paint* functions. */
export const SCREEN_ASSETS: ScreenAsset[] = [
  {
    id: 'atlas',
    label: 'Atlas Focus',
    // Optional overrides (PNG/SVG under public/screens/). Example:
    // phone: `${import.meta.env.BASE_URL}screens/phone-atlas.png`,
    paintPhone: paintAtlasPhone,
    paintTablet: paintAtlasTablet,
  },
  {
    id: 'meridian',
    label: 'Meridian Trails',
    paintPhone: paintMeridianPhone,
    paintTablet: paintAtlasTablet,
  },
]

/** Proportions tuned toward a modern iPhone (≈19.5:9) and portrait iPad. */
export const DEVICE = {
  phone: {
    width: 0.71,
    height: 1.48,
    depth: 0.078,
    radius: 0.105,
    bezel: 0.014,
  },
  tablet: {
    width: 1.12,
    height: 1.48,
    depth: 0.062,
    radius: 0.068,
    bezel: 0.032,
  },
} as const

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function createPaintedTexture(
  paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  width: number,
  height: number,
) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas 2D unavailable')
  }
  paint(ctx, width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}
