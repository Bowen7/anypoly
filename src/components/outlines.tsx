import { memo, useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useAtomValue, useSetAtom } from 'jotai'
import { createPortal } from '@react-three/fiber'
import { outlinesTargetAtom } from '@/lib/atom'

const OFFSET = 0.1

type SelectionProps = {
  deps: any[]
  color: string
}
export const Selection = memo(({ color, deps }: SelectionProps) => {
  const ref = useRef<THREE.Object3D>(null)
  const target = useAtomValue(outlinesTargetAtom)
  const [frameArgs, setFrameArgs] = useState<[number, number, number]>([0, 0, 0])
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0])

  useLayoutEffect(() => {
    if (!ref.current || !ref.current.parent) {
      return
    }
    const box = new THREE.Box3().setFromObject(ref.current.parent)
    const width = box.max.x - box.min.x + OFFSET
    const height = box.max.y - box.min.y + OFFSET
    const depth = box.max.z - box.min.z + OFFSET
    const x = (box.max.x + box.min.x) / 2
    const y = (box.max.y + box.min.y) / 2
    const z = (box.max.z + box.min.z) / 2
    setFrameArgs([width, height, depth])
    setPosition([x, y, z])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  if (!target) {
    return null
  }

  return (
    <>
      <object3D ref={ref} />
      {createPortal(
        <mesh position={position}>
          <boxGeometry args={frameArgs} />
          <meshBasicMaterial color={color} wireframe />
        </mesh>,
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
