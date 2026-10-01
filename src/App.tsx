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
    <div className="relative min-h-dvh overflow-hidden text-[var(--fog)]">
      <div className="atmosphere" aria-hidden />

      <header className="relative z-20 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
        <a href="#top" className="brand-mark text-[1.05rem] font-bold tracking-tight text-[var(--fog)] sm:text-lg">
          Nick Child
        </a>
        <nav className="flex items-center gap-5 text-sm text-[var(--mist)]">
          <a className="transition-colors hover:text-[var(--fog)]" href="#work">
            Work
          </a>
          <a className="transition-colors hover:text-[var(--fog)]" href="#about">
            About
          </a>
          <a
            className="hidden rounded-full border border-[color-mix(in_oklab,var(--lime)_35%,transparent)] px-3.5 py-1.5 text-[var(--lime)] transition-colors hover:bg-[color-mix(in_oklab,var(--lime)_12%,transparent)] sm:inline-flex"
            href="mailto:hello@nickchild.design"
          >
            Contact
          </a>
        </nav>
      </header>

      <main id="top" className="relative z-10">
        {/* Hero — brand + one line + CTA + device */}
        <section className="relative grid min-h-[calc(100dvh-4.5rem)] grid-cols-1 items-end lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <div className="relative z-10 px-5 pb-6 pt-10 sm:px-8 sm:pb-10 lg:pb-0 lg:pt-0">
            <p className="animate-rise device-hint mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--lime)]">
              Visual design folio
            </p>
            <h1 className="animate-rise-delay brand-mark max-w-[11ch] text-[clamp(2.8rem,8vw,5.6rem)] leading-[0.92] font-extrabold tracking-[-0.045em] text-[var(--fog)]">
              Nick Child
            </h1>
            <p className="animate-rise-delay-2 mt-5 max-w-[28ch] text-[1.05rem] leading-relaxed text-[var(--mist)] sm:text-lg">
              Product interfaces with{' '}
              <span className="serif-accent text-[1.2em] text-[var(--fog)]">tactile clarity</span>
              — mobile systems that expand into desktop calm.
            </p>

            <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-3">
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
                className="rounded-full border border-[color-mix(in_oklab,var(--fog)_22%,transparent)] px-5 py-2.5 text-sm font-medium text-[var(--fog)] transition-colors hover:border-[var(--lime)] hover:text-[var(--lime)]"
              >
                Swap case study
              </button>
            </div>

            <p className="mt-6 max-w-[34ch] text-xs leading-relaxed text-[color-mix(in_oklab,var(--mist)_80%,transparent)] sm:text-[0.8rem]">
              {isMobile
                ? 'Drag to orbit the device. Tap morph to flip between phone and portrait tablet.'
                : 'Drag to orbit · scroll to zoom · morph expands the chassis from phone to portrait iPad.'}
            </p>
          </div>

          <div className="relative h-[min(62dvh,560px)] w-full lg:h-[min(82dvh,760px)]">
            <DeviceScene
              mode={mode}
              phoneScreen={asset.phone}
              tabletScreen={asset.tablet}
              isMobile={isMobile}
            />
          </div>
        </section>

        <section id="work" className="relative px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--lime)]">
              Selected systems
            </p>
            <h2 className="brand-mark mt-3 max-w-[16ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-bold tracking-[-0.03em]">
              Screens living inside the device
            </h2>
            <p className="mt-4 max-w-[48ch] text-[var(--mist)]">
              Placeholder case studies ship with the folio so the 3D stage feels real on day one.
              Replace the SVG assets under <code className="text-[var(--lime)]">public/screens/</code> — wire them in{' '}
              <code className="text-[var(--lime)]">src/lib/portfolio.ts</code>.
            </p>

            <ul className="mt-12 space-y-0 border-t border-[color-mix(in_oklab,var(--fog)_12%,transparent)]">
              {SCREEN_ASSETS.map((item, index) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 border-b border-[color-mix(in_oklab,var(--fog)_12%,transparent)] py-7 sm:flex-row sm:items-end sm:justify-between"
                >
                  <div>
                    <p className="text-xs text-[var(--mist)]">0{index + 1}</p>
                    <h3 className="brand-mark mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                      {item.label}
                    </h3>
                    <p className="mt-2 max-w-[40ch] text-sm text-[var(--mist)]">
                      {item.id === 'atlas'
                        ? 'Focus OS for makers — dense mobile schedule that opens into a calm tablet board.'
                        : 'Outdoor planning with map atmosphere — phone itinerary, tablet route overview.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAssetId(item.id)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="self-start text-sm font-semibold text-[var(--lime)] underline-offset-4 hover:underline"
                  >
                    Load on device
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="about" className="relative px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h2 className="brand-mark text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-[-0.03em]">
                Designed for presence, not chrome
              </h2>
              <p className="mt-4 max-w-[46ch] leading-relaxed text-[var(--mist)]">
                Nick Child is a product designer focused on systems that feel physical — motion with
                weight, type with voice, and interfaces that hold up when you put them in someone’s hand.
              </p>
            </div>
            <div className="text-sm leading-relaxed text-[var(--mist)]">
              <p>
                Stack: Vite, React, Three.js via React Three Fiber / Drei. Hosted as a static build on
                GitHub Pages.
              </p>
              <a
                className="mt-5 inline-flex text-[var(--lime)] underline-offset-4 hover:underline"
                href="mailto:hello@nickchild.design"
              >
                hello@nickchild.design
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[color-mix(in_oklab,var(--fog)_10%,transparent)] px-5 py-6 text-xs text-[var(--mist)] sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <span className="brand-mark text-[var(--fog)]">Nick Child</span>
          <span>© {new Date().getFullYear()} · Visual design</span>
        </div>
      </footer>
    </div>
  )
}

export default App
