import { useAtomValue } from 'jotai'
import { useMemo, useRef } from 'react'
import type * as THREE from 'three'
import { BoundingBox } from './bounding-box'
import { Mesh } from './mesh'
import { focusedIdAtom } from '@/lib/atom'
import type { N3, PolyGroup, PolyObject } from '@/lib/types'
import { degToRadianN3 } from '@/lib/utils'
import { useLatestObject } from '@/lib'

type GroupProps = {
  isFocused: boolean
  object: PolyGroup
}
export function Group({ isFocused, object }: GroupProps) {
  const group = useLatestObject(object, isFocused) as PolyGroup
  const { position, rotation: [rx, ry, rz], scale, visible, children } = group
  const rotation = useMemo<N3>(() => degToRadianN3([rx, ry, rz]), [rx, ry, rz])
  const ref = useRef<THREE.Group>(null)

  const deps = useMemo(() => [position, scale, rotation], [position, scale, rotation])
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      visible={visible}
      ref={ref}
    >
      {children.map(child => (
        <Object key={child.id} object={child} />
      ))}
      {isFocused && (
        <BoundingBox
          target={ref}
          deps={deps}
          type="focus"
          visible={visible}
        />
      )}
    </group>
  )
}

type Props = {
  object: PolyObject
}
export function Object({ object }: Props) {
  const { id, type } = object
  const focusedId = useAtomValue(focusedIdAtom)
  const isFocused = id === focusedId

  return type === 'group'
    ? <Group isFocused={isFocused} object={object} />
    : <Mesh object={object} isFocused={isFocused} />
}
