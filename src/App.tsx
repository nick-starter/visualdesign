import { useMemo, useState } from 'react'
import { DeviceScene, useIsMobile } from './components/DeviceScene'
import {
  SCREEN_ASSETS,
  type DeviceMode,
} from './lib/portfolio'

function App() {
  const isMobile = useIsMobile()
  const [mode, setMode] = useState<DeviceMode>('phone')
  const [assetId, setAssetId] = useState(SCREEN_ASSETS[0].id)

  const asset = useMemo(
    () => SCREEN_ASSETS.find((item) => item.id === assetId) ?? SCREEN_ASSETS[0],
    [assetId],
  )

  return (
    <div className="relative h-dvh overflow-hidden text-[var(--fog)]">
      <div className="atmosphere" aria-hidden />

      {/* Full-viewport centered device */}
      <main className="absolute inset-0 z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full max-h-dvh">
            <DeviceScene mode={mode} asset={asset} isMobile={isMobile} />
          </div>
        </div>
      </main>

      {/* Controls — bottom center */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-8">
        <div className="pointer-events-auto animate-rise flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setMode((m) => (m === 'phone' ? 'tablet' : 'phone'))}
            className="rounded-full bg-[var(--lime)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {mode === 'phone' ? 'Morph to iPad' : 'Morph to phone'}
          </button>
          <button
            type="button"
            onClick={() =>
              setAssetId((id) =>
                id === SCREEN_ASSETS[0].id ? SCREEN_ASSETS[1].id : SCREEN_ASSETS[0].id,
              )
            }
            className="rounded-full border border-[color-mix(in_oklab,var(--fog)_22%,transparent)] bg-[color-mix(in_oklab,var(--ink)_55%,transparent)] px-5 py-2.5 text-sm font-medium text-[var(--fog)] backdrop-blur-sm transition-colors hover:border-[var(--lime)] hover:text-[var(--lime)]"
          >
            Swap case study
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
