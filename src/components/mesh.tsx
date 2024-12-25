import { useAtomValue, useSetAtom } from 'jotai'
import { memo, useCallback, useMemo, useState } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons'
import { Selection } from './outlines'
import { focusedIdAtom, focusedMeshAtom } from '@/lib/atom'
import type { Mesh3D, PathMesh3D, ShapeMesh3D } from '@/lib/types'

type UnifiedMeshProps = {
  mesh: PathMesh3D | ShapeMesh3D
  rotation: [number, number, number]
  isSelected: boolean
}
const UnifiedMesh = memo((props: UnifiedMeshProps) => {
  const { mesh, rotation, isSelected } = props
  const { position, scale, visible, type, args, color } = mesh
  const setFocusedMesh = useSetAtom(focusedMeshAtom)
  const [isHovered, setIsHovered] = useState(false)

  const onClick = useCallback(() => {
    setFocusedMesh(mesh)
  }, [mesh, setFocusedMesh])

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
      {isSelected && visible && (
        <Selection
          deps={deps}
          color="#f472b6"
        />
      )}
      {!isSelected && isHovered && visible && (
        <Selection
          deps={deps}
          color="#60a5fa"
        />
      )}
    </mesh>
  )
})

type MeshProps = {
  mesh: Mesh3D
}
export const Mesh = ({ mesh }: MeshProps) => {
  const { id, type, position, rotation: [rx, ry, rz], scale, visible } = mesh
  const focusedId = useAtomValue(focusedIdAtom)
  const isSelected = id === focusedId

  const rotation = useMemo<[number, number, number]>(() => {
    return [rx / 180 * Math.PI, ry / 180 * Math.PI, rz / 180 * Math.PI]
  }, [rx, ry, rz])
  const deps = useMemo(() => [position, scale, rotation], [position, scale, rotation])

  if (type === 'group') {
    return (
      <group
        position={position}
        rotation={rotation}
        scale={scale}
        visible={visible}
      >
        {mesh.children.map(child => (
          <Mesh key={child.id} mesh={child} />
        ))}
        {isSelected && visible && (
          <Selection
            deps={deps}
            color="#f472b6"
          />
        )}
      </group>
    )
  }
  return <UnifiedMesh mesh={mesh} rotation={rotation} isSelected={isSelected} />
}
