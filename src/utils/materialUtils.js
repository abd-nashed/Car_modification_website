import * as THREE from 'three'

// تصنيف المواد
export function classifyMesh(mesh) {
  if (mesh.userData._ctype) return mesh.userData._ctype

  const meshName = (mesh.name || '').toLowerCase()
  const matName =
    (
      Array.isArray(mesh.material)
        ? mesh.material[0]?.name
        : mesh.material?.name
    )?.toLowerCase() || ''

  const full = meshName + ' | ' + matName
  let result = 'other'

  // BODY
  if (
    matName.includes('carpaint') ||
    matName.match(/paint_?max/i) ||
    matName.includes('remap__prim') ||
    matName.includes('remap__sec') ||
    matName === 'colors__spec' ||
    matName.includes('stripes')
  ) {
    result = 'body'
  }
  // GLASS
  else if (
    matName.includes('glass') ||
    matName.includes('window') ||
    matName === 'windows' ||
    matName.includes('windshield')
  ) {
    result = matName.includes('mirror') ? 'ignore' : 'glass'
  }
  // WHEEL
  else if (
    matName.includes('wheel') ||
    matName.includes('rim') ||
    matName.includes('tire') ||
    matName.includes('tyre') ||
    matName.includes('advan') ||
    matName.includes('ad08') ||
    matName.includes('sidewall') ||
    matName === 'alium' ||
    matName === 'alium2'
  ) {
    result = 'wheel'
  }
  // IGNORE
  else if (
    matName.includes('brake') ||
    matName.includes('disc') ||
    matName.includes('discextras') ||
    matName.includes('engine') ||
    matName.includes('cooler') ||
    matName.includes('rad_prop') ||
    matName.includes('interior') ||
    matName.includes('cockpit') ||
    matName.includes('belt') ||
    matName.includes('cabin') ||
    matName.includes('weld') ||
    matName.includes('bulloni') ||
    matName.includes('badge') ||
    matName.includes('logo') ||
    matName.includes('emblem') ||
    matName.includes('plate') ||
    matName.includes('decal') ||
    matName.includes('driftinghu') ||
    matName.includes('mirror') ||
    matName.includes('light_d') ||
    matName.includes('mat_plastic') ||
    matName.includes('mat_rubber') ||
    matName.includes('mat_metal') ||
    matName === 'black' ||
    matName.includes('chrome') ||
    matName.includes('plastic') ||
    matName.includes('nickel') ||
    matName.includes('lightglass') ||
    matName.includes('light_')
  ) {
    result = 'ignore'
  }
  // حسب mesh
  else if (
    full.includes('interior') ||
    full.includes('seat') ||
    full.includes('steering') ||
    full.includes('dashboard') ||
    full.includes('console') ||
    full.includes('engine') ||
    full.includes('exhaust') ||
    full.includes('suspension') ||
    full.includes('carbon') ||
    full.includes('calliper') ||
    full.includes('caliper') ||
    full.includes('brake')
  ) {
    result = 'ignore'
  } else if (
    full.includes('glass') ||
    full.includes('window') ||
    full.includes('windshield')
  ) {
    result = 'glass'
  } else if (
    full.includes('wheel') ||
    full.includes('rim') ||
    full.includes('tire') ||
    full.includes('tyre')
  ) {
    result = 'wheel'
  } else if (
    full.includes('paint') ||
    full.includes('body') ||
    full.includes('chassis') ||
    full.includes('shell') ||
    full.includes('exterior') ||
    full.includes('door') ||
    full.includes('hood') ||
    full.includes('trunk') ||
    full.includes('fender') ||
    full.includes('bumper') ||
    full.includes('boot') ||
    full.includes('splitter')
  ) {
    result = 'body'
  }

  mesh.userData._ctype = result
  return result
}


export function applyColors(
  scene,
  {
    bodyColor,
    wheelColor,
    glassColor,
    glassOpacity,
    clearcoatEnabled = true,
    clearcoatIntensity = 1,
  }
) {
  const bodyC = new THREE.Color(bodyColor)
  const wheelC = new THREE.Color(wheelColor)
  const glassC = new THREE.Color(glassColor)

  bodyC.convertSRGBToLinear()
  wheelC.convertSRGBToLinear()
  glassC.convertSRGBToLinear()

  const stats = { body: 0, wheel: 0, glass: 0, ignored: 0, other: 0 }

  scene.traverse((child) => {
    if (!child.isMesh) return

    const type = classifyMesh(child)
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material]

    materials.forEach((mat) => {
      if (!mat) return

      switch (type) {
        case 'glass':
          mat.color.copy(glassC)
          mat.transparent = true
          mat.opacity = glassOpacity
          mat.roughness = 0.05
          mat.metalness = 0.1
          if ('transmission' in mat && mat.transmission > 0)
            mat.transmission = 0.85
          stats.glass++
          break

        case 'wheel':
          mat.color.copy(wheelC)
          mat.metalness = 0.7
          mat.roughness = 0.4
          stats.wheel++
          break

        case 'body':
          mat.color.copy(bodyC)
          mat.metalness = 0.4
          mat.roughness = 0.3
          if ('clearcoat' in mat) {
            mat.clearcoat = clearcoatEnabled ? clearcoatIntensity : 0
            mat.clearcoatRoughness = 0.1
          }
          if ('envMapIntensity' in mat) {
            mat.envMapIntensity = clearcoatEnabled ? 1.0 : 0.6
          }
          stats.body++
          break

        case 'ignore':
          stats.ignored++
          break

        default:
          stats.other++
          break
      }

      mat.needsUpdate = true
    })
  })

  console.log('🎨 Stats:', stats)
  return stats
}


// Clone Materials

export function cloneMaterials(scene) {
  scene.traverse((child) => {
    if (!child.isMesh) return
    if (Array.isArray(child.material)) {
      child.material = child.material.map((m) => m.clone())
    } else if (child.material) {
      child.material = child.material.clone()
    }
  })
}