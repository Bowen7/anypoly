import type { ComponentPropsWithoutRef } from 'react'
import { useRef } from 'react'
import { PivotControls } from '@react-three/drei'
import * as THREE from 'three'
import { useFocusedObject, useUpdateObject } from '@/lib'
import type { Number3 } from '@/lib/types'

const add = (a: THREE.Vector3, b: Number3): Number3 => {
  return [a.x + b[0], a.y + b[1], a.z + b[2]]
}

type Props = ComponentPropsWithoutRef<typeof PivotControls>
export const Controls = (props: Props) => {
  const object = useFocusedObject()
  const updateObject = useUpdateObject()
  const initialTransform = useRef<{ position: Number3, rotation: Number3, scale: Number3 } | null>(null)
  const onDragStart = () => {
    if (!object) {
      return
    }
    initialTransform.current = {
      position: object.position,
      rotation: object.rotation,
      scale: object.scale,
    }
  }
  const onDrag = (local: THREE.Matrix4) => {
    if (!initialTransform.current) {
      return
    }
    const position = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    local.decompose(position, quaternion, scale)
    const rotation = new THREE.Euler().setFromQuaternion(quaternion)
    updateObject({ position: add(position, initialTransform.current.position) }, false)
  }
  const onDragEnd = () => {
    console.log(456)
    initialTransform.current = null
    updateObject({})
  }
  return (
    <PivotControls
      depthTest={false}
      annotations
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      {...props}
    />
  )
}
