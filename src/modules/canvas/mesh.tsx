import { useAtomValue, useSetAtom } from 'jotai'
import { forwardRef, memo, useCallback, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Addition, Base, Difference, Geometry, Intersection, ReverseSubtraction, Subtraction } from '@react-three/csg'
import { BoundingBox } from './bounding-box'
import { Controls } from './controls'
import { Object } from './object'
import { focusedObjectAtom, isDraggingAtom } from '@/lib/atom'
import type { CSGOperation, N3, PolyMesh } from '@/lib/types'
import { useLatestObject, useMeshGeometry } from '@/lib'
import { degToRadianN3 } from '@/lib/utils'

type MeshContainerProps = {
  children: React.ReactNode
  parentCSGEnabled: boolean
  operation: CSGOperation
} & React.ComponentProps<'mesh'>
const MeshContainer = forwardRef<THREE.Mesh, MeshContainerProps>(({ children, parentCSGEnabled, operation, ...props }, ref) => {
  if (parentCSGEnabled) {
    const { position, rotation, scale, geometry } = props
    const operationProps = {
      position,
      rotation,
      scale,
      geometry,
    }
    switch (operation) {
      case 'add':
        return <Addition {...operationProps}>{children}</Addition>
      case 'subtract':
        return <Subtraction {...operationProps}>{children}</Subtraction>
      case 'intersect':
        return <Intersection {...operationProps}>{children}</Intersection>
      case 'reverseSubtract':
        return <ReverseSubtraction {...operationProps}>{children}</ReverseSubtraction>
      case 'diff':
        return <Difference {...operationProps}>{children}</Difference>
    }
  }
  return <mesh ref={ref} {...props}>{children}</mesh>
})

type Props = {
  object: PolyMesh
  isFocused: boolean
  parentCSGEnabled?: boolean
}
export const Mesh = memo((props: Props) => {
  const { object, isFocused, parentCSGEnabled = false } = props
  const mesh = useLatestObject(object, isFocused) as PolyMesh
  const { position, scale, rotation: [rx, ry, rz], visible, type, args, color, csgEnabled } = mesh
  const ref = useRef<THREE.Mesh>(null)
  const setFocusedObject = useSetAtom(focusedObjectAtom)
  const [isHovered, setIsHovered] = useState(false)
  const isDragging = useAtomValue(isDraggingAtom)

  const onClick = useCallback(() => {
    if (!isFocused && !isDragging) {
      setFocusedObject(mesh)
    }
  }, [mesh, setFocusedObject, isFocused, isDragging])

  const extrude = type === 'path' ? mesh.extrude : false

  const rotation = useMemo<N3>(() => degToRadianN3([rx, ry, rz]), [rx, ry, rz])
  const geometry = useMeshGeometry(mesh)

  const deps = useMemo(() =>
    [position, scale, rotation, args, extrude], [position, scale, rotation, args, extrude])

  const meshProps = parentCSGEnabled
    ? {
        position,
        rotation,
        scale,
        geometry,
      }
    : {
        ref,
        position,
        rotation,
        scale,
        visible,
        geometry,
        onClick,
        onPointerOver: () => setIsHovered(true),
        onPointerOut: () => setIsHovered(false),
      }

  return (
    <>
      <MeshContainer
        parentCSGEnabled={parentCSGEnabled}
        operation={mesh.csgOperation}
        {...meshProps}
      >
        {!parentCSGEnabled && csgEnabled && (
          <Geometry>
            <Base geometry={geometry} />
            {mesh.children.map(child => (
              <Object key={child.id} object={child} parentCSGEnabled={csgEnabled} />
            ))}
          </Geometry>
        )}
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        {!parentCSGEnabled && isFocused && (
          <BoundingBox
            target={ref}
            deps={deps}
            type="focus"
            visible={visible}
          />
        )}
        {!parentCSGEnabled && !isFocused && isHovered && (
          <BoundingBox
            target={ref}
            deps={deps}
            type="hover"
            visible={visible}
          />
        )}
      </MeshContainer>
      {isFocused && (
        <Controls
          position={position}
          rotation={rotation}
          scale={scale}
          visible={visible}
        />
      )}
    </>
  )
})
