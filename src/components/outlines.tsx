import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useAtomValue, useSetAtom } from 'jotai'
import { createPortal } from '@react-three/fiber'
import { outlinesTargetAtom } from '@/lib/atom'

const OFFSET = 0.1

type SelectionProps = {
  position: [number, number, number]
  scale: [number, number, number]
  rotation: [number, number, number]
  args: number[]
}
export const Selection = memo(({ args, position, scale, rotation }: SelectionProps) => {
  const ref = useRef<THREE.Object3D>(null)
  const target = useAtomValue(outlinesTargetAtom)
  const [frameArgs, setFrameArgs] = useState<[number, number, number]>([0, 0, 0])

  useLayoutEffect(() => {
    if (!ref.current || !ref.current.parent) {
      return
    }
    const box = new THREE.Box3().setFromObject(ref.current.parent)
    const width = box.max.x - box.min.x + OFFSET
    const height = box.max.y - box.min.y + OFFSET
    const depth = box.max.z - box.min.z + OFFSET
    setFrameArgs([width, height, depth])
  }, [scale, rotation, args])

  if (!target) {
    return null
  }

  return (
    <>
      <object3D ref={ref} />
      {createPortal(
        <mesh position={position}>
          <boxGeometry args={frameArgs} />
          <meshBasicMaterial color="#f472b6" wireframe />
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
