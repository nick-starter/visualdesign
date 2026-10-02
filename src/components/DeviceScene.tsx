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
import { SCREEN_SIZE, type DeviceMode, type ScreenAsset } from '../lib/portfolio'
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
  const isPhone = mode === 'phone'

  useEffect(() => {
    const node = canvasRef.current
    if (!node) return
    const w = isPhone ? SCREEN_SIZE.phone.w : SCREEN_SIZE.tablet.w
    const h = isPhone ? SCREEN_SIZE.phone.h : SCREEN_SIZE.tablet.h
    node.width = w
    node.height = h
    const ctx = node.getContext('2d')
    if (!ctx) return
    if (isPhone) asset.paintPhone(ctx, w, h)
    else asset.paintTablet(ctx, w, h)

    if (isPhone) {
      const ix = w / 2
      const iy = 28
      const iw = 118
      const ih = 34
      ctx.fillStyle = '#050506'
      ctx.beginPath()
      ctx.roundRect(ix - iw / 2, iy - ih / 2, iw, ih, ih / 2)
      ctx.fill()
      ctx.beginPath()
      ctx.fillStyle = '#1a2740'
      ctx.arc(ix + 28, iy, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.fillStyle = '#222'
      ctx.arc(ix - 14, iy, 3.5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Landscape iPad front camera cue
      const cx = w / 2
      const cy = 18
      ctx.beginPath()
      ctx.fillStyle = '#2a2d33'
      ctx.arc(cx, cy, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.fillStyle = '#152033'
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [mode, asset, isPhone])

  return (
    <div className="flex h-full w-full items-center justify-center p-6 pb-24">
      <div
        key={mode}
        className="relative animate-rise"
        style={{
          width: isPhone ? 'min(28vw, 150px)' : 'min(48vw, 300px)',
          maxHeight: '70vh',
          aspectRatio: isPhone ? '9 / 19.5' : '4 / 3',
        }}
      >
        <div
          className="absolute inset-0 shadow-[0_28px_70px_rgba(0,0,0,0.55)]"
          style={{
            borderRadius: isPhone ? '22% / 11%' : '8% / 10%',
            background: isPhone
              ? 'linear-gradient(145deg, #a8adb4 0%, #7c8188 38%, #9aa0a7 62%, #6e737a 100%)'
              : 'linear-gradient(145deg, #b4b8be 0%, #8a8f96 40%, #a2a7ae 65%, #757a81 100%)',
            boxShadow:
              '0 28px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.35)',
          }}
        />
        {/* Side buttons */}
        {isPhone ? (
          <>
            <div
              className="absolute"
              style={{
                right: -3,
                top: '28%',
                width: 3,
                height: '9%',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #7a7f86, #b0b5bc)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: -3,
                top: '22%',
                width: 3,
                height: '4%',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #b0b5bc, #7a7f86)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: -3,
                top: '30%',
                width: 3,
                height: '6%',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #b0b5bc, #7a7f86)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: -3,
                top: '38%',
                width: 3,
                height: '6%',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #b0b5bc, #7a7f86)',
              }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute"
              style={{
                right: -3,
                top: '38%',
                width: 3,
                height: '10%',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #8a8f96, #c0c4ca)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: -3,
                top: '32%',
                width: 3,
                height: '6%',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #c0c4ca, #8a8f96)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: -3,
                top: '42%',
                width: 3,
                height: '6%',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #c0c4ca, #8a8f96)',
              }}
            />
          </>
        )}
        <div
          className="absolute overflow-hidden bg-black"
          style={{
            inset: isPhone ? '1.6%' : '2.2%',
            borderRadius: isPhone ? '19% / 9.5%' : '6% / 7.5%',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.65)',
          }}
        >
          <canvas ref={canvasRef} className="h-full w-full" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(125deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 32%, transparent 48%)',
            }}
          />
        </div>
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
