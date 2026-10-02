import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  DEVICE,
  createPaintedTexture,
  easeInOutCubic,
  lerp,
  type DeviceMode,
  type ScreenAsset,
} from '../lib/portfolio'

type MorphDeviceProps = {
  mode: DeviceMode
  asset: ScreenAsset
}

function buildRoundedShape(width: number, height: number, radius: number) {
  const s = new THREE.Shape()
  const w = width
  const h = height
  const r = Math.min(radius, w / 2, h / 2)
  s.moveTo(-w / 2 + r, -h / 2)
  s.lineTo(w / 2 - r, -h / 2)
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  s.lineTo(w / 2, h / 2 - r)
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  s.lineTo(-w / 2 + r, h / 2)
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  s.lineTo(-w / 2, -h / 2 + r)
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)
  return s
}

export function MorphDevice({ mode, asset }: MorphDeviceProps) {
  const group = useRef<THREE.Group>(null)
  const shell = useRef<THREE.Mesh>(null)
  const backGlass = useRef<THREE.Mesh>(null)
  const frontBezel = useRef<THREE.Mesh>(null)
  const screen = useRef<THREE.Mesh>(null)
  const glass = useRef<THREE.Mesh>(null)
  const island = useRef<THREE.Group>(null)
  const cameraIsland = useRef<THREE.Group>(null)
  const speaker = useRef<THREE.Mesh>(null)
  const port = useRef<THREE.Mesh>(null)
  const sideButtons = useRef<THREE.Group>(null)
  const progress = useRef(mode === 'tablet' ? 1 : 0)
  const modeRef = useRef(mode)
  modeRef.current = mode

  const phoneTex = useMemo(
    () => createPaintedTexture(asset.paintPhone, 390, 844),
    [asset],
  )
  const tabletTex = useMemo(
    () => createPaintedTexture(asset.paintTablet, 768, 1024),
    [asset],
  )

  useEffect(() => {
    return () => {
      phoneTex.dispose()
      tabletTex.dispose()
    }
  }, [phoneTex, tabletTex])

  const titanium = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8e9298',
        metalness: 0.97,
        roughness: 0.26,
        envMapIntensity: 1.4,
      }),
    [],
  )
  const titaniumDark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#6a6e74',
        metalness: 0.95,
        roughness: 0.32,
        envMapIntensity: 1.25,
      }),
    [],
  )
  const blackGlass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0b0b0e',
        metalness: 0.4,
        roughness: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.15,
      }),
    [],
  )
  const lensRing = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2a2d33',
        metalness: 0.9,
        roughness: 0.22,
      }),
    [],
  )
  const lensGlass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#152033',
        metalness: 0.15,
        roughness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        transparent: true,
        opacity: 0.92,
      }),
    [],
  )
  const islandMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#050506',
        roughness: 0.32,
        metalness: 0.25,
      }),
    [],
  )

  const baseShape = useMemo(
    () =>
      buildRoundedShape(
        DEVICE.phone.width,
        DEVICE.phone.height,
        DEVICE.phone.radius,
      ),
    [],
  )
  const frontShape = useMemo(
    () =>
      buildRoundedShape(
        DEVICE.phone.width - 0.012,
        DEVICE.phone.height - 0.012,
        DEVICE.phone.radius - 0.006,
      ),
    [],
  )
  const backShape = useMemo(
    () =>
      buildRoundedShape(
        DEVICE.phone.width - 0.02,
        DEVICE.phone.height - 0.02,
        DEVICE.phone.radius - 0.012,
      ),
    [],
  )

  const extrudeSettings = useMemo(
    () => ({
      depth: DEVICE.phone.depth,
      bevelEnabled: true,
      bevelThickness: 0.011,
      bevelSize: 0.009,
      bevelSegments: 6,
      curveSegments: 32,
    }),
    [],
  )
  const thinExtrude = useMemo(
    () => ({
      depth: 0.0035,
      bevelEnabled: true,
      bevelThickness: 0.0015,
      bevelSize: 0.0015,
      bevelSegments: 2,
      curveSegments: 28,
    }),
    [],
  )

  useFrame((state, delta) => {
    const target = modeRef.current === 'tablet' ? 1 : 0
    progress.current += (target - progress.current) * Math.min(1, delta * 4.2)
    const t = easeInOutCubic(progress.current)

    const width = lerp(DEVICE.phone.width, DEVICE.tablet.width, t)
    const depth = lerp(DEVICE.phone.depth, DEVICE.tablet.depth, t)
    const bezel = lerp(DEVICE.phone.bezel, DEVICE.tablet.bezel, t)
    const height = DEVICE.phone.height
    const scaleX = width / DEVICE.phone.width
    const scaleZ = depth / DEVICE.phone.depth

    if (shell.current) shell.current.scale.set(scaleX, 1, scaleZ)
    if (backGlass.current) {
      backGlass.current.scale.set(scaleX, 1, 1)
      backGlass.current.position.z = -0.001
    }
    if (frontBezel.current) {
      frontBezel.current.scale.set(scaleX, 1, 1)
      frontBezel.current.position.z = depth + 0.0008
    }

    const screenW = width - bezel * 2
    const screenH = height - bezel * 2
    const screenZ = depth + 0.0058
    const inset = lerp(0.0035, 0.01, t)

    if (screen.current) {
      screen.current.scale.set(screenW - inset, screenH - inset, 1)
      screen.current.position.z = screenZ
      const mat = screen.current.material as THREE.MeshBasicMaterial
      const nextMap = t < 0.48 ? phoneTex : tabletTex
      if (mat.map !== nextMap) {
        mat.map = nextMap
        mat.needsUpdate = true
      }
    }

    if (glass.current) {
      glass.current.scale.set(screenW - inset * 0.5, screenH - inset * 0.5, 1)
      glass.current.position.z = screenZ + 0.0014
      const gMat = glass.current.material as THREE.MeshPhysicalMaterial
      gMat.opacity = lerp(0.09, 0.05, t)
    }

    if (island.current) {
      island.current.position.set(0, height / 2 - bezel - 0.042, screenZ + 0.0022)
      island.current.scale.set(lerp(1, 0.5, t), lerp(1, 0.65, t), 1)
      island.current.visible = t < 0.88
    }

    if (cameraIsland.current) {
      cameraIsland.current.position.set(
        -width / 2 + 0.155,
        height / 2 - 0.195,
        -0.005,
      )
      cameraIsland.current.visible = t < 0.5
      cameraIsland.current.scale.setScalar(lerp(1, 0.15, Math.min(1, t * 2.2)))
    }

    if (speaker.current) {
      speaker.current.position.set(0, -height / 2 + 0.011, depth * 0.55)
      speaker.current.scale.set(scaleX, 1, 1)
      speaker.current.visible = t < 0.7
    }

    if (port.current) {
      port.current.position.set(0, -height / 2 + 0.001, depth * 0.5)
      port.current.scale.set(lerp(1, 0.55, t), 1, lerp(1, 0.65, t))
    }

    if (sideButtons.current) {
      const kids = sideButtons.current.children
      if (kids[0]) kids[0].position.set(width / 2 + 0.0045, 0.17, depth / 2)
      if (kids[1]) kids[1].position.set(-width / 2 - 0.0045, 0.3, depth / 2)
      if (kids[2]) kids[2].position.set(-width / 2 - 0.0045, 0.19, depth / 2)
      if (kids[3]) kids[3].position.set(-width / 2 - 0.0045, 0.095, depth / 2)
      sideButtons.current.visible = t < 0.82
    }

    if (group.current) {
      const time = state.clock.elapsedTime
      group.current.position.y = Math.sin(time * 0.7) * 0.022
      group.current.rotation.y = -0.48 + Math.sin(time * 0.18) * 0.035
    }
  })

  return (
    <group ref={group} position={[0, 0.02, 0]} rotation={[-0.12, 0, 0.012]}>
      {/* Titanium / aluminum chassis */}
      <mesh ref={shell} castShadow receiveShadow material={titanium}>
        <extrudeGeometry args={[baseShape, extrudeSettings]} />
      </mesh>

      {/* Back glass */}
      <mesh ref={backGlass} material={blackGlass} position={[0, 0, -0.001]}>
        <extrudeGeometry args={[backShape, thinExtrude]} />
      </mesh>

      {/* Front ceramic/black mask under OLED */}
      <mesh ref={frontBezel} material={blackGlass}>
        <extrudeGeometry args={[frontShape, thinExtrude]} />
      </mesh>

      {/* Screen */}
      <mesh ref={screen}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={phoneTex} toneMapped={false} />
      </mesh>

      {/* Cover glass */}
      <mesh ref={glass}>
        <planeGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          color="#eef3f8"
          transparent
          opacity={0.09}
          roughness={0.04}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Dynamic Island */}
      <group ref={island}>
        <mesh material={islandMat}>
          <planeGeometry args={[0.15, 0.036]} />
        </mesh>
        <mesh position={[-0.057, 0, 0.0004]} material={islandMat}>
          <circleGeometry args={[0.018, 28]} />
        </mesh>
        <mesh position={[0.057, 0, 0.0004]} material={islandMat}>
          <circleGeometry args={[0.018, 28]} />
        </mesh>
        <mesh position={[0.04, 0, 0.001]} material={lensRing}>
          <circleGeometry args={[0.0095, 22]} />
        </mesh>
        <mesh position={[0.04, 0, 0.0014]} material={lensGlass}>
          <circleGeometry args={[0.0065, 22]} />
        </mesh>
        <mesh position={[-0.018, 0, 0.001]}>
          <circleGeometry args={[0.0045, 16]} />
          <meshStandardMaterial color="#18181c" roughness={0.45} metalness={0.4} />
        </mesh>
      </group>

      {/* Rear camera island */}
      <group ref={cameraIsland}>
        <mesh material={titaniumDark} position={[0, 0, 0]}>
          <boxGeometry args={[0.205, 0.205, 0.014]} />
        </mesh>
        {(
          [
            [-0.05, 0.05],
            [0.05, 0.05],
            [-0.05, -0.05],
          ] as const
        ).map(([x, y], i) => (
          <group key={i} position={[x, y, 0.002]}>
            <mesh material={titaniumDark} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.012, 32]} />
            </mesh>
            <mesh position={[0, 0, 0.008]} material={lensRing}>
              <circleGeometry args={[0.028, 32]} />
            </mesh>
            <mesh position={[0, 0, 0.009]} material={lensGlass}>
              <circleGeometry args={[0.02, 32]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.05, -0.05, 0.01]}>
          <circleGeometry args={[0.011, 18]} />
          <meshStandardMaterial
            color="#f3ecd4"
            emissive="#e8d9a0"
            emissiveIntensity={0.3}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.015, -0.015, 0.01]}>
          <circleGeometry args={[0.004, 12]} />
          <meshStandardMaterial color="#1c1c20" roughness={0.55} />
        </mesh>
      </group>

      {/* Bottom speaker */}
      <mesh ref={speaker} material={titaniumDark}>
        <boxGeometry args={[0.13, 0.005, 0.011]} />
      </mesh>

      {/* USB-C */}
      <mesh ref={port} material={titaniumDark}>
        <boxGeometry args={[0.052, 0.009, 0.015]} />
      </mesh>

      {/* Side buttons */}
      <group ref={sideButtons}>
        <mesh material={titanium}>
          <boxGeometry args={[0.01, 0.105, 0.026]} />
        </mesh>
        <mesh material={titanium}>
          <boxGeometry args={[0.008, 0.038, 0.02]} />
        </mesh>
        <mesh material={titanium}>
          <boxGeometry args={[0.008, 0.052, 0.02]} />
        </mesh>
        <mesh material={titanium}>
          <boxGeometry args={[0.008, 0.052, 0.02]} />
        </mesh>
      </group>
    </group>
  )
}
