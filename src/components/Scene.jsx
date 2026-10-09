import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  MeshReflectorMaterial,
  Lightformer,
} from '@react-three/drei'
import { EffectComposer, Bloom, N8AO, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { CarModel } from './CarModel'
import { useCarStore } from '../store/useCarStore'

function LoadingFallback() {
  return (
    <Html center>
      <div
        style={{
          color: '#fff',
          fontSize: 12,
          letterSpacing: 4,
          textTransform: 'uppercase',
          opacity: 0.6,
        }}
      >
        Loading Showroom...
      </div>
    </Html>
  )
}

function LuxuryLightRing() {
  const lights = useMemo(() => {
    const arr = []
    const count = 12
    const radius = 5
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      arr.push({
        position: [Math.cos(angle) * radius, 3.5, Math.sin(angle) * radius],
        rotation: [0, -angle, 0],
      })
    }
    return arr
  }, [])

  return (
    <group>
      {lights.map((l, i) => (
        <mesh key={i} position={l.position} rotation={l.rotation}>
          <boxGeometry args={[1.2, 0.02, 0.15]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

export function Scene() {
  const selectedCar = useCarStore((s) => s.selectedCar)

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      camera={{ position: [7, 3, 7], fov: 35 }}
    >
      <color attach="background" args={['#08080a']} />
      <fog attach="fog" args={['#08080a', 20, 45]} />

      <ambientLight intensity={0.15} />

      <spotLight
        position={[8, 12, 6]}
        angle={0.4}
        penumbra={1}
        intensity={3.5}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      <spotLight
        position={[-8, 10, -6]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        color="#aaccff"
      />

      <spotLight
        position={[0, 6, -10]}
        angle={0.6}
        penumbra={1}
        intensity={2.5}
        color="#ff9944"
      />

      <Environment resolution={256} frames={1} background={false}>
        <Lightformer
          intensity={2}
          position={[0, 5, -9]}
          scale={[10, 5, 1]}
        />
        <Lightformer
          intensity={1.5}
          position={[-5, 1, -1]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[10, 2, 1]}
        />
        <Lightformer
          intensity={1.5}
          position={[5, 1, -1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[10, 2, 1]}
        />
        <Lightformer
          intensity={1}
          position={[0, -5, 5]}
          scale={[10, 5, 1]}
        />
        <Lightformer
          intensity={0.5}
          position={[0, 10, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[15, 15, 1]}
        />
      </Environment>

      <LuxuryLightRing />

      <Suspense fallback={<LoadingFallback />}>
        <CarModel key={selectedCar.id} />
      </Suspense>

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.8}
        scale={20}
        blur={2}
        far={8}
        resolution={512}
        frames={1}
        color="#000000"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[100, 50]}
          resolution={512}
          mixBlur={1}
          mixStrength={30}
          roughness={0.9}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0c"
          metalness={0.6}
          mirror={0.3}
        />
      </mesh>

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={16}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.4}
        target={[0, 0.6, 0]}
        enableDamping
        dampingFactor={0.05}
      />

      <EffectComposer multisampling={0}>
        <N8AO
          aoRadius={0.6}
          intensity={3}
          distanceFalloff={1.2}
          color="black"
          halfRes
          quality="performance"
        />
        <Bloom intensity={0.8} luminanceThreshold={0.75} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  )
}