import type { Mesh3D, PathMesh3D } from '@/lib/types'
import { selectedAtom } from '@/lib/atom'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons'

type MeshObjectProps = {
  mesh: Mesh3D
}

type PathMeshProps = {
  mesh: PathMesh3D
  rotation: [number, number, number]
  isSelected: boolean
  onDoubleClick: () => void
}
const PathMesh = ({ mesh, rotation, isSelected, onDoubleClick }: PathMeshProps) => {
  const { position, scale, visible, extrude, d, args, bevelEnabled, color } = mesh
  const geometry = useMemo(() => {
    const loader = new SVGLoader()
    const paths = loader.parse(`<path d="${d}" />`).paths
    const shapes = SVGLoader.createShapes(paths[0])
    return extrude
      ? new THREE.ExtrudeGeometry(shapes[0], {
        curveSegments: args[0],
        steps: args[1],
        depth: args[2],
        bevelEnabled,
        bevelThickness: args[3],
        bevelSize: args[4],
        bevelOffset: args[5],
        bevelSegments: args[6],
      })
      : new THREE.ShapeGeometry(shapes[0], args[0])
  }, [d, args, bevelEnabled, extrude])

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      visible={visible}
      geometry={geometry}
      onDoubleClick={onDoubleClick}
    >
      <meshStandardMaterial
        color={color}
        side={extrude ? THREE.FrontSide : THREE.DoubleSide}
      />
    </mesh>
  )
}

export const MeshObject = ({ mesh }: MeshObjectProps) => {
  const { id, type, position, rotation: [rx, ry, rz], scale, visible } = mesh
  const [selected, setSelected] = useAtom(selectedAtom)
  const isSelected = id === selected

  const onDoubleClick = () => {
    setSelected(id)
  }

  const rotation = useMemo<[number, number, number]>(() => {
    return [rx / 180 * Math.PI, ry / 180 * Math.PI, rz / 180 * Math.PI]
  }, [rx, ry, rz])

  if (type === 'group') {
    return (
      <group position={position} rotation={rotation} scale={scale} visible={visible}>
        {mesh.children.map(child => (
          <MeshObject key={child.id} mesh={child} />
        ))}
      </group>
    )
  }
  if (type === 'path') {
    return (
      <PathMesh
        mesh={mesh}
        rotation={rotation}
        isSelected={isSelected}
        onDoubleClick={onDoubleClick}
      />
    )
  }

  return (
    <mesh position={position} rotation={rotation} scale={scale} visible={visible} onDoubleClick={onDoubleClick}>
      {type === 'box' && <boxGeometry args={mesh.args as [number, number, number]} />}
      {type === 'sphere' && <sphereGeometry args={mesh.args as [number, number, number]} />}
      {type === 'circle' && <circleGeometry args={mesh.args as [number, number, number]} />}
      {type === 'cylinder' && <cylinderGeometry args={mesh.args as [number, number, number]} />}
      {type === 'cone' && <coneGeometry args={mesh.args as [number, number, number]} />}
      {type === 'plane' && <planeGeometry args={mesh.args as [number, number, number]} />}
      <meshStandardMaterial color={mesh.color} />
    </mesh>
  )
}
