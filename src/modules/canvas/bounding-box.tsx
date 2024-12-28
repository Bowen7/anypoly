import { memo, useLayoutEffect, useState } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'
import { Portal } from '@/components/portal'

type BoundingBoxProps = {
  target: React.RefObject<THREE.Object3D>
  type: 'focus' | 'hover'
  visible: boolean
  deps: any[]
}
export const BoundingBox = memo(({ target, type, visible, deps }: BoundingBoxProps) => {
  const [position, setPosition] = useState<THREE.Vector3>(new THREE.Vector3())
  const [geometry, setGeometry] = useState<THREE.BoxGeometry | null>(null)

  useLayoutEffect(() => {
    if (!target.current || !target.current.parent) {
      return
    }
    const box = new THREE.Box3().setFromObject(target.current.parent)
    const dimensions = new THREE.Vector3().subVectors(box.max, box.min).add(new THREE.Vector3(0.1, 0.1, 0.1))
    const position = box.getCenter(new THREE.Vector3())
    setGeometry(new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z))
    setPosition(position)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return (
    <Portal>
      {geometry && (
        <Edges
          color={type === 'focus' ? '#f472b6' : '#60a5fa'}
          geometry={geometry}
          position={position}
          visible={visible}
        >
          <meshBasicMaterial />
        </Edges>
      )}
    </Portal>
  )
})
