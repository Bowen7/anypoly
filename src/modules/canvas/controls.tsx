import { useMemo, useRef } from 'react'
import { PivotControls } from '@react-three/drei'
import * as THREE from 'three'
import { useCSG } from '@react-three/csg'
import { useAtom } from 'jotai'
import { isDraggingAtom, useUpdateObject } from '@/lib'
import type { N3 } from '@/lib/types'
import { quatToDegN3, toFixedN3, v3ToN3 } from '@/lib/utils'

type Props = {
  center?: THREE.Vector3
  position: N3
  rotation: N3
  scale: N3
  visible: boolean
}
const DEFAULT_CENTER = new THREE.Vector3()

export const Controls = ({ center = DEFAULT_CENTER, position, rotation, scale, visible }: Props) => {
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom)
  const updateObject = useUpdateObject()
  const transformRef = useRef<{
    position: N3
    rotation: N3
    scale: N3
  } | null>(null)

  const csg = useCSG()

  const matrix = useMemo(() => {
    const matrix = new THREE.Matrix4()
    const euler = new THREE.Euler(...rotation)
    const quaternion = new THREE.Quaternion().setFromEuler(euler)
    matrix.compose(new THREE.Vector3(...position), quaternion, new THREE.Vector3(...scale))
    return matrix
  }, [position, rotation, scale])

  const onDrag = (local: THREE.Matrix4) => {
    if (!isDragging) {
      setIsDragging(true)
    }
    const position = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    local.decompose(position, quaternion, scale)
    transformRef.current = {
      position: v3ToN3(position),
      rotation: quatToDegN3(quaternion),
      scale: v3ToN3(scale),
    }
    updateObject(transformRef.current, false)
    csg?.update()
  }
  const onDragEnd = () => {
    if (transformRef.current) {
      const { position, rotation, scale } = transformRef.current
      updateObject({
        position: toFixedN3(position),
        rotation: toFixedN3(rotation),
        scale: toFixedN3(scale),
      })
    }
    transformRef.current = null
    setIsDragging(false)
  }
  return (
    <group userData={{ ignore: true }} visible={visible} position={center}>
      <PivotControls
        matrix={matrix}
        depthTest={false}
        scale={1.5}
        annotations
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />
    </group>
  )
}
