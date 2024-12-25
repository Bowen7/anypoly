import { memo, useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useAtomValue, useSetAtom } from 'jotai'
import { createPortal } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import { outlinesTargetAtom } from '@/lib/atom'

type SelectionProps = {
  deps: any[]
  color: string
}
export const Selection = memo(({ color, deps }: SelectionProps) => {
  const ref = useRef<THREE.Object3D>(null)
  const target = useAtomValue(outlinesTargetAtom)
  const [position, setPosition] = useState<THREE.Vector3>(new THREE.Vector3())
  const [geometry, setGeometry] = useState<THREE.BoxGeometry | null>(null)

  useLayoutEffect(() => {
    if (!ref.current || !ref.current.parent) {
      return
    }
    const box = new THREE.Box3().setFromObject(ref.current.parent)
    const dimensions = new THREE.Vector3().subVectors(box.max, box.min)
    const position = box.getCenter(new THREE.Vector3())
    setGeometry(new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z))
    setPosition(position)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return (
    <>
      <object3D ref={ref} />
      {target && geometry && createPortal(
        (
          <Edges
            color={color}
            scale={1.1}
            geometry={geometry}
            position={position}
          >
            <meshBasicMaterial color={color} />
          </Edges>
        ),
        target,
      )}
    </>
  )
})

export const Outlines = memo(() => {
  const ref = useRef<THREE.Object3D>(null)
  const setTarget = useSetAtom(outlinesTargetAtom)
  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }
    setTarget(ref.current)
    return () => {
      setTarget(null)
    }
  }, [setTarget])
  return (
    <object3D ref={ref} />
  )
})
