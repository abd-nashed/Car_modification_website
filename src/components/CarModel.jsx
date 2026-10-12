import { useEffect, useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useCarStore } from '../store/useCarStore'
import { cloneMaterials, applyColors } from '../utils/materialUtils'

const BASE_PATH = '/models/'

export function CarModel({ onLoad }) {
  const {
    selectedCar,
    bodyColor,
    wheelColor,
    glassColor,
    glassOpacity,
    clearcoatEnabled,
    clearcoatIntensity,
  } = useCarStore()

  const groupRef = useRef()
  const { scene } = useGLTF(BASE_PATH + selectedCar.file)

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    cloneMaterials(clone)
    clone.traverse((child) => {
      if (child.isMesh) delete child.userData._ctype
    })
    return clone
  }, [scene])

  useEffect(() => {
    if (!clonedScene) return

    const box = new THREE.Box3().setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    const size = new THREE.Vector3()
    box.getSize(size)

    clonedScene.position.x -= center.x
    clonedScene.position.z -= center.z

    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 4.5
    const scale = targetSize / maxDim
    clonedScene.scale.setScalar(scale)

    clonedScene.updateMatrixWorld(true)
    const boxAfter = new THREE.Box3().setFromObject(clonedScene)
    clonedScene.position.y -= boxAfter.min.y

    onLoad?.()
  }, [clonedScene, onLoad])

  useEffect(() => {
    if (!clonedScene) return
    applyColors(clonedScene, {
      bodyColor,
      wheelColor,
      glassColor,
      glassOpacity,
      clearcoatEnabled,
      clearcoatIntensity,
    })
  }, [
    clonedScene,
    bodyColor,
    wheelColor,
    glassColor,
    glassOpacity,
    clearcoatEnabled,
    clearcoatIntensity,
  ])

  useEffect(() => {
    return () => {
      clonedScene?.traverse((child) => {
        if (child.isMesh) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose())
          } else if (child.material) {
            child.material.dispose()
          }
        }
      })
    }
  }, [clonedScene])

  return <primitive ref={groupRef} object={clonedScene} />
}