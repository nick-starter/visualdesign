import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  DEVICE,
  createPaintedTexture,
  type DeviceMode,
  type ScreenAsset,
} from '../lib/portfolio'

type MorphDeviceProps = {
  mode: DeviceMode
  asset: ScreenAsset
}

type DeviceSpec = {
  width: number
  height: number
  depth: number
  radius: number
  bezel: number
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

function setGroupOpacity(root: THREE.Object3D, opacity: number) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const mat of mats) {
      if (!mat) continue
      mat.transparent = true
      mat.opacity = opacity * (mat.userData.baseOpacity ?? 1)
      mat.depthWrite = opacity > 0.95
      mat.needsUpdate = true
    }
  })
}

function rememberBaseOpacity(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const mat of mats) {
      if (!mat || mat.userData.baseOpacity != null) continue
      mat.userData.baseOpacity = mat.opacity ?? 1
    }
  })
}

function DeviceChassis({
  spec,
  texture,
  variant,
  materials,
}: {
  spec: DeviceSpec
  texture: THREE.CanvasTexture
  variant: 'phone' | 'tablet'
  materials: {
    titanium: THREE.MeshStandardMaterial
    titaniumDark: THREE.MeshStandardMaterial
    blackGlass: THREE.MeshPhysicalMaterial
    lensRing: THREE.MeshStandardMaterial
    lensGlass: THREE.MeshPhysicalMaterial
    islandMat: THREE.MeshStandardMaterial
    coverGlass: THREE.MeshPhysicalMaterial
  }
}) {
  const {
    titanium,
    titaniumDark,
    blackGlass,
    lensRing,
    lensGlass,
    islandMat,
    coverGlass,
  } = materials

  const shellShape = useMemo(
    () => buildRoundedShape(spec.width, spec.height, spec.radius),
    [spec],
  )
  const frontShape = useMemo(
    () =>
      buildRoundedShape(
        spec.width - (variant === 'phone' ? 0.012 : 0.018),
        spec.height - (variant === 'phone' ? 0.012 : 0.018),
        spec.radius - (variant === 'phone' ? 0.006 : 0.008),
      ),
    [spec, variant],
  )
  const backShape = useMemo(
    () =>
      buildRoundedShape(
        spec.width - (variant === 'phone' ? 0.02 : 0.028),
        spec.height - (variant === 'phone' ? 0.02 : 0.028),
        spec.radius - (variant === 'phone' ? 0.012 : 0.014),
      ),
    [spec, variant],
  )

  const extrudeSettings = useMemo(
    () => ({
      depth: spec.depth,
      bevelEnabled: true,
      bevelThickness: variant === 'phone' ? 0.011 : 0.008,
      bevelSize: variant === 'phone' ? 0.009 : 0.007,
      bevelSegments: 6,
      curveSegments: 32,
    }),
    [spec.depth, variant],
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

  const inset = variant === 'phone' ? 0.0035 : 0.01
  const screenW = spec.width - spec.bezel * 2 - inset
  const screenH = spec.height - spec.bezel * 2 - inset
  const screenZ = spec.depth + 0.0058
  const glassW = spec.width - spec.bezel * 2 - inset * 0.5
  const glassH = spec.height - spec.bezel * 2 - inset * 0.5

  return (
    <group>
      <mesh castShadow receiveShadow material={titanium}>
        <extrudeGeometry args={[shellShape, extrudeSettings]} />
      </mesh>

      <mesh material={blackGlass} position={[0, 0, -0.001]}>
        <extrudeGeometry args={[backShape, thinExtrude]} />
      </mesh>

      <mesh material={blackGlass} position={[0, 0, spec.depth + 0.0008]}>
        <extrudeGeometry args={[frontShape, thinExtrude]} />
      </mesh>

      <mesh position={[0, 0, screenZ]} scale={[screenW, screenH, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, screenZ + 0.0014]} scale={[glassW, glassH, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={coverGlass} attach="material" />
      </mesh>

      {variant === 'phone' && (
        <>
          <group position={[0, spec.height / 2 - spec.bezel - 0.042, screenZ + 0.0022]}>
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

          <group position={[-spec.width / 2 + 0.155, spec.height / 2 - 0.195, -0.005]}>
            <mesh material={titaniumDark}>
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
          </group>

          <mesh
            material={titaniumDark}
            position={[0, -spec.height / 2 + 0.011, spec.depth * 0.55]}
          >
            <boxGeometry args={[0.13, 0.005, 0.011]} />
          </mesh>

          <mesh
            material={titanium}
            position={[spec.width / 2 + 0.0045, 0.17, spec.depth / 2]}
          >
            <boxGeometry args={[0.01, 0.105, 0.026]} />
          </mesh>
          <mesh
            material={titanium}
            position={[-spec.width / 2 - 0.0045, 0.3, spec.depth / 2]}
          >
            <boxGeometry args={[0.008, 0.038, 0.02]} />
          </mesh>
          <mesh
            material={titanium}
            position={[-spec.width / 2 - 0.0045, 0.19, spec.depth / 2]}
          >
            <boxGeometry args={[0.008, 0.052, 0.02]} />
          </mesh>
          <mesh
            material={titanium}
            position={[-spec.width / 2 - 0.0045, 0.095, spec.depth / 2]}
          >
            <boxGeometry args={[0.008, 0.052, 0.02]} />
          </mesh>
        </>
      )}

      <mesh
        material={titaniumDark}
        position={[0, -spec.height / 2 + 0.001, spec.depth * 0.5]}
      >
        <boxGeometry args={[variant === 'phone' ? 0.052 : 0.04, 0.009, 0.015]} />
      </mesh>
    </group>
  )
}

/** Discrete phone / iPad models with a short crossfade — no chassis morph. */
export function MorphDevice({ mode, asset }: MorphDeviceProps) {
  const root = useRef<THREE.Group>(null)
  const phoneGroup = useRef<THREE.Group>(null)
  const tabletGroup = useRef<THREE.Group>(null)
  const shown = useRef<DeviceMode>(mode)
  const opacity = useRef(1)
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

  const materials = useMemo(() => {
    const coverGlass = new THREE.MeshPhysicalMaterial({
      color: '#eef3f8',
      transparent: true,
      opacity: 0.09,
      roughness: 0.04,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
    })
    coverGlass.userData.baseOpacity = 0.09

    return {
      titanium: new THREE.MeshStandardMaterial({
        color: '#8e9298',
        metalness: 0.97,
        roughness: 0.26,
        envMapIntensity: 1.4,
      }),
      titaniumDark: new THREE.MeshStandardMaterial({
        color: '#6a6e74',
        metalness: 0.95,
        roughness: 0.32,
        envMapIntensity: 1.25,
      }),
      blackGlass: new THREE.MeshPhysicalMaterial({
        color: '#0b0b0e',
        metalness: 0.4,
        roughness: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.15,
      }),
      lensRing: new THREE.MeshStandardMaterial({
        color: '#2a2d33',
        metalness: 0.9,
        roughness: 0.22,
      }),
      lensGlass: new THREE.MeshPhysicalMaterial({
        color: '#152033',
        metalness: 0.15,
        roughness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        transparent: true,
        opacity: 0.92,
      }),
      islandMat: new THREE.MeshStandardMaterial({
        color: '#050506',
        roughness: 0.32,
        metalness: 0.25,
      }),
      coverGlass,
    }
  }, [])

  useEffect(() => {
    if (phoneGroup.current) rememberBaseOpacity(phoneGroup.current)
    if (tabletGroup.current) rememberBaseOpacity(tabletGroup.current)
  }, [materials, phoneTex, tabletTex])

  useFrame((state, delta) => {
    const targetMode = modeRef.current
    const speed = 7

    if (targetMode !== shown.current) {
      opacity.current = Math.max(0, opacity.current - delta * speed)
      if (opacity.current <= 0.001) {
        shown.current = targetMode
        opacity.current = 0
      }
    } else {
      opacity.current = Math.min(1, opacity.current + delta * speed)
    }

    const showPhone = shown.current === 'phone'
    if (phoneGroup.current) {
      phoneGroup.current.visible = showPhone
      if (showPhone) setGroupOpacity(phoneGroup.current, opacity.current)
    }
    if (tabletGroup.current) {
      tabletGroup.current.visible = !showPhone
      if (!showPhone) setGroupOpacity(tabletGroup.current, opacity.current)
    }

    if (root.current) {
      const time = state.clock.elapsedTime
      root.current.position.y = Math.sin(time * 0.7) * 0.022
      root.current.rotation.y = -0.48 + Math.sin(time * 0.18) * 0.035
    }
  })

  return (
    <group ref={root} position={[0, 0.02, 0]} rotation={[-0.12, 0, 0.012]}>
      <group ref={phoneGroup}>
        <DeviceChassis
          spec={DEVICE.phone}
          texture={phoneTex}
          variant="phone"
          materials={materials}
        />
      </group>
      <group ref={tabletGroup} visible={false}>
        <DeviceChassis
          spec={DEVICE.tablet}
          texture={tabletTex}
          variant="tablet"
          materials={materials}
        />
      </group>
    </group>
  )
}
