import { useAtomValue } from 'jotai'
import { useMemo, useRef } from 'react'
import type * as THREE from 'three'
import { BoundingBox } from './bounding-box'
import { Mesh } from './mesh'
import { focusedIdAtom } from '@/lib/atom'
import type { PolyObject } from '@/lib/types'

type Props = {
  object: PolyObject
}
export const Object = ({ object }: Props) => {
  const { id, type, position, rotation: [rx, ry, rz], scale, visible } = object
  const focusedId = useAtomValue(focusedIdAtom)
  const isSelected = id === focusedId
  const ref = useRef<THREE.Group>(null)
  const rotation = useMemo<[number, number, number]>(() => {
    return [rx / 180 * Math.PI, ry / 180 * Math.PI, rz / 180 * Math.PI]
  }, [rx, ry, rz])
  const deps = useMemo(() => [position, scale, rotation], [position, scale, rotation])

  if (type === 'group') {
    const focusBoxEnabled = visible && isSelected
    return (
      <group
        position={position}
        rotation={rotation}
        scale={scale}
        visible={visible}
        ref={ref}
      >
        {object.children.map(child => (
          <Object key={child.id} object={child} />
        ))}
        {focusBoxEnabled && (
          <BoundingBox
            target={ref}
            deps={deps}
            type="focus"
          />
        )}
      </group>
    )
  }
  return <Mesh mesh={object} rotation={rotation} isSelected={isSelected} />
}
