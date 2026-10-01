import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import type { DeviceMode } from '../lib/portfolio'
import { MorphDevice } from './MorphDevice'

type DeviceSceneProps = {
  mode: DeviceMode
  phoneScreen: string
  tabletScreen: string
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

export function DeviceScene({
  mode,
  phoneScreen,
  tabletScreen,
  isMobile,
}: DeviceSceneProps) {
  return (
    <div className="canvas-shell absolute inset-0">
      <Canvas
        shadows
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 0.12, isMobile ? 3.55 : 3.15], fov: isMobile ? 40 : 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[3.2, 4.8, 2.4]}
          intensity={1.3}
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight
          position={[-2.8, 2.2, 2]}
          intensity={0.5}
          angle={0.55}
          penumbra={0.65}
          color="#c8f07a"
        />
        <Suspense fallback={<SceneFallback />}>
          <MorphDevice
            mode={mode}
            phoneScreen={phoneScreen}
            tabletScreen={tabletScreen}
          />
          <Environment preset="city" environmentIntensity={0.5} />
          <ContactShadows
            position={[0, -1.08, 0]}
            opacity={0.42}
            scale={8}
            blur={2.8}
            far={3}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={!isMobile}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 1.7}
          minDistance={2.3}
          maxDistance={4.6}
          target={[0, -0.05, 0]}
          rotateSpeed={isMobile ? 0.5 : 0.72}
        />
      </Canvas>
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
