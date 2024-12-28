import { useSetAtom } from 'jotai'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { BoundingBox } from './bounding-box'
import { Controls } from './controls'
import { focusedObjectAtom } from '@/lib/atom'
import type { N3, PolyMesh } from '@/lib/types'
import { useLatestObject, useMeshGeometry } from '@/lib'
import { degToRadianN3 } from '@/lib/utils'

type Props = {
  object: PolyMesh
  isFocused: boolean
}
export const Mesh = memo((props: Props) => {
  const { object, isFocused } = props
  const mesh = useLatestObject(object, isFocused) as PolyMesh
  const { position, scale, rotation: [rx, ry, rz], visible, type, args, color } = mesh
  const ref = useRef<THREE.Mesh>(null)
  const setFocusedObject = useSetAtom(focusedObjectAtom)
  const [isHovered, setIsHovered] = useState(false)

  const onClick = useCallback(() => {
    if (!isFocused) {
      setFocusedObject(mesh)
    }
  }, [mesh, setFocusedObject, isFocused])

  const extrude = type === 'path' ? mesh.extrude : false

  const rotation = useMemo<N3>(() => degToRadianN3([rx, ry, rz]), [rx, ry, rz])
  const geometry = useMeshGeometry(mesh)

  const deps = useMemo(() =>
    [position, scale, rotation, args, extrude], [position, scale, rotation, args, extrude])

  return (
    <>
      <mesh
        ref={ref}
        position={position}
        rotation={rotation}
        scale={scale}
        visible={visible}
        geometry={geometry}
        onClick={onClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        {/* {focusBoxEnabled && (
          <BoundingBox
            target={ref}
            deps={deps}
            type="focus"
          />
        )} */}
        {!isFocused && isHovered && (
          <BoundingBox
            target={ref}
            deps={deps}
            type="hover"
            visible={visible}
          />
        )}
      </mesh>
      {isFocused && (
        <Controls
          position={position}
          rotation={rotation}
          scale={scale}
        />
      )}
    </>
  )
})
