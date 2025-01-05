import { useAtomValue } from 'jotai'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { BoundingBox } from './bounding-box'
import { Mesh } from './mesh'
import { Controls } from './controls'
import { focusedIdAtom } from '@/lib/atom'
import type { N3, PolyGroup, PolyObject } from '@/lib/types'
import { degToRadianN3 } from '@/lib/utils'
import { getBoxFromObject, useLatestObject } from '@/lib'

type GroupProps = {
  isFocused: boolean
  object: PolyGroup
}
export function Group({ isFocused, object }: GroupProps) {
  const group = useLatestObject(object, isFocused) as PolyGroup
  const { children } = object
  const { position, rotation: [rx, ry, rz], scale, visible } = group
  const rotation = useMemo<N3>(() => degToRadianN3([rx, ry, rz]), [rx, ry, rz])
  const ref = useRef<THREE.Group>(null)
  const [center, setCenter] = useState<THREE.Vector3 | undefined>(undefined)

  const deps = useMemo(() => [position, scale, rotation, children], [position, scale, rotation, children])

  useLayoutEffect(() => {
    if (!ref.current || !isFocused) {
      return
    }
    const box = getBoxFromObject(ref.current)
    const center = box.getCenter(new THREE.Vector3())
    setCenter(center.sub(new THREE.Vector3(...position)))
  }, [isFocused, children, position])

  return (
    <>
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
      {isFocused && (
        <Controls
          center={center}
          position={position}
          rotation={rotation}
          scale={scale}
          visible={visible}
        />
      )}
    </>
  )
}

type Props = {
  object: PolyObject
  parentCSGEnabled?: boolean
}
export function Object({ object, parentCSGEnabled = false }: Props) {
  const { id, type } = object
  const focusedId = useAtomValue(focusedIdAtom)
  const isFocused = id === focusedId

  return type === 'group'
    ? <Group isFocused={isFocused} object={object} />
    : <Mesh object={object} isFocused={isFocused} parentCSGEnabled={parentCSGEnabled} />
}
