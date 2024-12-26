import { memo, useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'
import { Portal } from '@/components/portal'

type BoundingBoxProps = {
  type: 'focus' | 'hover'
  deps: any[]
}
export const BoundingBox = memo(({ type, deps }: BoundingBoxProps) => {
  const ref = useRef<THREE.Object3D>(null)
  const [position, setPosition] = useState<THREE.Vector3>(new THREE.Vector3())
  const [geometry, setGeometry] = useState<THREE.BoxGeometry | null>(null)

  useLayoutEffect(() => {
    if (!ref.current || !ref.current.parent) {
      return
    }
    const box = new THREE.Box3().setFromObject(ref.current.parent)
    const dimensions = new THREE.Vector3().subVectors(box.max, box.min).add(new THREE.Vector3(0.1, 0.1, 0.1))
    const position = box.getCenter(new THREE.Vector3())
    setGeometry(new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z))
    setPosition(position)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return (
    <>
      <object3D ref={ref} />
      <Portal>
        {geometry && (
          <Edges
            color={type === 'focus' ? '#f472b6' : '#60a5fa'}
            geometry={geometry}
            position={position}
          >
            <meshBasicMaterial />
          </Edges>
        )}
      </Portal>
    </>
  )
})
