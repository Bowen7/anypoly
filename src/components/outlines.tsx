import { memo, useEffect, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useAtomValue, useSetAtom } from 'jotai'
import { outlinesAtom } from '@/lib/atom'

const OFFSET = 0.1

type SelectionProps = {
  position: [number, number, number]
  scale: [number, number, number]
  rotation: [number, number, number]
  args: number[]
}
export const Selection = memo(({ args, position, scale, rotation }: SelectionProps) => {
  const ref = useRef<THREE.Group>(null)
  const setOutlines = useSetAtom(outlinesAtom)

  useLayoutEffect(() => {
    if (!ref.current || !ref.current.parent) {
      return
    }
    const box = new THREE.Box3().setFromObject(ref.current.parent)
    const width = box.max.x - box.min.x + OFFSET
    const height = box.max.y - box.min.y + OFFSET
    const depth = box.max.z - box.min.z + OFFSET
    const geometry = new THREE.BoxGeometry(width, height, depth)
    setOutlines({ position, geometry })
  }, [position, scale, rotation, args, setOutlines])

  useEffect(() => {
    return () => {
      setOutlines(null)
    }
  }, [setOutlines])

  return (
    <group ref={ref} />
  )
})

export const Outlines = memo(() => {
  const { position, geometry } = useAtomValue(outlinesAtom) ?? {}

  return (
    geometry && (
      <mesh
        position={position}
        geometry={geometry}
      >
        <meshStandardMaterial color="hotpink" wireframe />
      </mesh>
    )
  )
})
