import { ContactShadows, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { DeviceMode, ScreenAsset } from '../lib/portfolio'
import { MorphDevice } from './MorphDevice'

type DeviceSceneProps = {
  mode: DeviceMode
  asset: ScreenAsset
  isMobile: boolean
}

function SceneFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.72, 1.52, 0.09]} />
      <meshStandardMaterial color="#1a1f1c" metalness={0.6} roughness={0.4} />
    </mesh>
  )
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

function FlatDevicePreview({ mode, asset }: { mode: DeviceMode; asset: ScreenAsset }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const node = canvasRef.current
    if (!node) return
    const w = mode === 'tablet' ? 768 : 390
    const h = mode === 'tablet' ? 1024 : 844
    node.width = w
    node.height = h
    const ctx = node.getContext('2d')
    if (!ctx) return
    if (mode === 'tablet') asset.paintTablet(ctx, w, h)
    else asset.paintPhone(ctx, w, h)
  }, [mode, asset])

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div
        className="overflow-hidden rounded-[2rem] border border-[color-mix(in_oklab,var(--fog)_18%,transparent)] bg-[#171c19] shadow-[0_30px_80px_rgba(0,0,0,0.45)] transition-all duration-700"
        style={{
          // ~30% smaller than the prior flat preview sizes
          width: mode === 'tablet' ? 'min(36vw, 224px)' : 'min(29vw, 154px)',
          aspectRatio: mode === 'tablet' ? '3 / 4' : '9 / 19',
        }}
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </div>
  )
}

export function DeviceScene({ mode, asset, isMobile }: DeviceSceneProps) {
  return (
    <div className="canvas-shell absolute inset-0">
      <WebGLErrorBoundary fallback={<FlatDevicePreview mode={mode} asset={asset} />}>
        <Canvas
          shadows={false}
          dpr={[1, isMobile ? 1.25 : 1.75]}
          camera={{ position: [0, 0.05, isMobile ? 3.4 : 3.05], fov: isMobile ? 38 : 32 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
          }}
        >
          <ambientLight intensity={0.45} />
          <hemisphereLight args={['#e8eef5', '#1a1c18', 0.55]} />
          <directionalLight position={[3.4, 5.2, 2.8]} intensity={1.55} color="#fff6ea" />
          <directionalLight position={[-3.2, 2.4, 1.2]} intensity={0.55} color="#b8c4d8" />
          <directionalLight position={[0.6, 1.2, -3.5]} intensity={0.65} color="#dfe7f2" />
          <spotLight
            position={[-2.4, 3.2, 2.4]}
            intensity={0.55}
            angle={0.5}
            penumbra={0.7}
            color="#c8f07a"
          />
          <Suspense fallback={<SceneFallback />}>
            {/* ~30% smaller on-screen presence; framing/controls stay the same */}
            <group scale={0.7}>
              <MorphDevice mode={mode} asset={asset} />
              <ContactShadows
                position={[0, -1.08, 0]}
                opacity={0.38}
                scale={8}
                blur={2.8}
                far={3}
              />
            </group>
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={!isMobile}
            minPolarAngle={Math.PI / 3.4}
            maxPolarAngle={Math.PI / 1.7}
            minDistance={2.3}
            maxDistance={4.6}
            target={[0, 0.02, 0]}
            rotateSpeed={isMobile ? 0.5 : 0.72}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  )
}

export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint,
  )

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])

  return mobile
}
