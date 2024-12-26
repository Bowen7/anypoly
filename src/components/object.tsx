import { useAtomValue, useSetAtom } from 'jotai'
import { memo, useCallback, useMemo, useState } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons'
import { BoundingBox } from './bounding-box'
import { focusedIdAtom, focusedObjectAtom } from '@/lib/atom'
import type { PolyMesh, PolyObject } from '@/lib/types'

type MeshProps = {
  mesh: PolyMesh
  rotation: [number, number, number]
  isSelected: boolean
}
const Mesh = memo((props: MeshProps) => {
  const { mesh, rotation, isSelected } = props
  const { position, scale, visible, type, args, color } = mesh
  const setFocusedObject = useSetAtom(focusedObjectAtom)
  const [isHovered, setIsHovered] = useState(false)

  const onClick = useCallback(() => {
    setFocusedObject(mesh)
  }, [mesh, setFocusedObject])

  const d = type === 'path' ? mesh.d : ''
  const extrude = type === 'path' ? mesh.extrude : false

  const geometry = useMemo(() => {
    switch (type) {
      case 'box':
        return new THREE.BoxGeometry(...args)
      case 'sphere':
        return new THREE.SphereGeometry(args[0], args[1], args[2], args[3], args[4] * Math.PI, args[5], args[6] * Math.PI)
      case 'circle':
        return new THREE.CircleGeometry(args[0], args[1], args[2], args[3] * Math.PI)
      case 'cylinder':
        return new THREE.CylinderGeometry(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7] * Math.PI)
      case 'cone':
        return new THREE.ConeGeometry(args[0], args[1], args[2], args[3], args[4], args[5], args[6] * Math.PI)
      case 'plane':
        return new THREE.PlaneGeometry(...args)
      case 'path': {
        const loader = new SVGLoader()
        const paths = loader.parse(`<path d="${d}" />`).paths
        const shapes = SVGLoader.createShapes(paths[0])
        const geometry = extrude
          ? new THREE.ExtrudeGeometry(shapes[0], {
            curveSegments: args[0],
            steps: args[1],
            depth: args[2],
            bevelEnabled: args[3],
            bevelThickness: args[4],
            bevelSize: args[5],
            bevelOffset: args[6],
            bevelSegments: args[7],
          })
          : new THREE.ShapeGeometry(shapes[0], args[0])
        geometry.center()
        return geometry
      }
      default:
        return undefined
    }
  }, [type, args, d, extrude])

  const deps = useMemo(() => [position, scale, rotation, args, extrude], [position, scale, rotation, args, extrude])

  const focusBoxEnabled = visible && isSelected
  const hoverBoxEnabled = visible && !isSelected && isHovered

  return (
    <mesh
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
      {focusBoxEnabled && (
        <BoundingBox
          deps={deps}
          type="focus"
        />
      )}
      {hoverBoxEnabled && (
        <BoundingBox
          deps={deps}
          type="hover"
        />
      )}
    </mesh>
  )
})

type ObjectProps = {
  object: PolyObject
}
export const Object = ({ object }: ObjectProps) => {
  const { id, type, position, rotation: [rx, ry, rz], scale, visible } = object
  const focusedId = useAtomValue(focusedIdAtom)
  const isSelected = id === focusedId

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
      >
        {object.children.map(child => (
          <Object key={child.id} object={child} />
        ))}
        {focusBoxEnabled && (
          <BoundingBox
            deps={deps}
            type="focus"
          />
        )}
      </group>
    )
  }
  return <Mesh mesh={object} rotation={rotation} isSelected={isSelected} />
}
