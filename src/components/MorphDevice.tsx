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
  const screen = useRef<THREE.Mesh>(null)
  const glass = useRef<THREE.Mesh>(null)
  const notch = useRef<THREE.Mesh>(null)
  const btnRight = useRef<THREE.Mesh>(null)
  const btnLeft = useRef<THREE.Mesh>(null)
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

  const baseShape = useMemo(
    () =>
      buildRoundedShape(
        DEVICE.phone.width,
        DEVICE.phone.height,
        DEVICE.phone.radius,
      ),
    [],
  )

  const extrudeSettings = useMemo(
    () => ({
      depth: DEVICE.phone.depth,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.006,
      bevelSegments: 3,
      curveSegments: 18,
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

    if (shell.current) {
      shell.current.scale.set(scaleX, 1, scaleZ)
    }

    const screenW = width - bezel * 2
    const screenH = height - bezel * 2
    const screenZ = depth + 0.002

    if (screen.current) {
      screen.current.scale.set(screenW, screenH, 1)
      screen.current.position.z = screenZ
      const mat = screen.current.material as THREE.MeshBasicMaterial
      const nextMap = t < 0.48 ? phoneTex : tabletTex
      if (mat.map !== nextMap) {
        mat.map = nextMap
        mat.needsUpdate = true
      }
    }

    if (glass.current) {
      glass.current.scale.set(screenW, screenH, 1)
      glass.current.position.z = screenZ + 0.001
    }

    if (notch.current) {
      notch.current.position.set(0, height / 2 - bezel * 1.7, screenZ + 0.002)
      notch.current.scale.set(lerp(1, 0.72, t), 1, 1)
      notch.current.visible = t < 0.92
    }

    if (btnRight.current) {
      btnRight.current.position.set(width / 2 + 0.005, 0.22, depth / 2)
    }
    if (btnLeft.current) {
      btnLeft.current.position.set(-width / 2 - 0.004, 0.28, depth / 2)
    }

    if (group.current) {
      const time = state.clock.elapsedTime
      group.current.position.y = Math.sin(time * 0.7) * 0.032
      group.current.rotation.y = -0.32 + Math.sin(time * 0.22) * 0.06
    }
  })

  return (
    <group ref={group} position={[0, -0.04, 0]} rotation={[-0.1, 0, 0.03]}>
      <mesh ref={shell} castShadow receiveShadow>
        <extrudeGeometry args={[baseShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#171c19"
          metalness={0.88}
          roughness={0.26}
          envMapIntensity={1.15}
        />
      </mesh>

      <mesh ref={screen}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={phoneTex} toneMapped={false} />
      </mesh>

      <mesh ref={glass}>
        <planeGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.055}
          roughness={0.12}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.2}
        />
      </mesh>

      <mesh ref={notch}>
        <planeGeometry args={[0.16, 0.028]} />
        <meshStandardMaterial color="#050705" roughness={0.45} metalness={0.15} />
      </mesh>

      <mesh ref={btnRight}>
        <boxGeometry args={[0.01, 0.12, 0.034]} />
        <meshStandardMaterial color="#2a302c" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh ref={btnLeft}>
        <boxGeometry args={[0.008, 0.055, 0.026]} />
        <meshStandardMaterial color="#2a302c" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  )
}
