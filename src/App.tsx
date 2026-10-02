import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { DeviceScene, useIsMobile } from './components/DeviceScene'
import {
  SCREEN_ASSETS,
  type DeviceMode,
} from './lib/portfolio'

function initialMode(): DeviceMode {
  if (typeof window === 'undefined') return 'phone'
  const q = new URLSearchParams(window.location.search).get('mode')
  return q === 'tablet' || q === 'ipad' ? 'tablet' : 'phone'
}

function App() {
  const isMobile = useIsMobile()
  const [mode, setMode] = useState<DeviceMode>(initialMode)
  const [assetId, setAssetId] = useState(SCREEN_ASSETS[0].id)

  const asset = useMemo(
    () => SCREEN_ASSETS.find((item) => item.id === assetId) ?? SCREEN_ASSETS[0],
    [assetId],
  )

  const controls = (
    <div
      className="device-controls"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        zIndex: 2147483647,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 1rem',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
        }}
      >
        <button
          type="button"
          data-testid="toggle-device"
          onClick={() => setMode((m) => (m === 'phone' ? 'tablet' : 'phone'))}
          style={{
            borderRadius: 9999,
            background: '#c8f07a',
            color: '#070a09',
            border: 'none',
            padding: '0.7rem 1.35rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
          }}
        >
          {mode === 'phone' ? 'Show iPad' : 'Show iPhone'}
        </button>
        <button
          type="button"
          data-testid="swap-case-study"
          onClick={() =>
            setAssetId((id) =>
              id === SCREEN_ASSETS[0].id ? SCREEN_ASSETS[1].id : SCREEN_ASSETS[0].id,
            )
          }
          style={{
            borderRadius: 9999,
            background: 'rgba(0,0,0,0.55)',
            color: '#dce6df',
            border: '1px solid rgba(255,255,255,0.22)',
            padding: '0.7rem 1.35rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
          }}
        >
          Swap case study
        </button>
      </div>
    </div>
  )

  return (
    <div className="relative h-dvh overflow-hidden text-[var(--fog)]">
      <div className="atmosphere" aria-hidden />

      <main className="absolute inset-0 z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full max-h-dvh">
            <DeviceScene mode={mode} asset={asset} isMobile={isMobile} />
          </div>
        </div>
      </main>

      {typeof document !== 'undefined'
        ? createPortal(controls, document.body)
        : controls}
    </div>
  )
}

export default App
