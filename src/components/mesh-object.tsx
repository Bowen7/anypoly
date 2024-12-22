import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { Outlines } from '@react-three/drei'
import { SVGLoader } from 'three/addons'
import * as THREE from 'three'
import type { Mesh3D, PathMesh3D } from '@/lib/types'
import { selectedAtom } from '@/lib/atom'

type MeshObjectProps = {
  mesh: Mesh3D
}

type PathMeshProps = {
  mesh: PathMesh3D
  rotation: [number, number, number]
  isSelected: boolean
}
const PathMesh = ({ mesh, rotation, isSelected }: PathMeshProps) => {
  const { position, scale, visible } = mesh
  const geometry = useMemo(() => {
    const loader = new SVGLoader()
    const paths = loader.parse(`<path d="${mesh.d}" />`).paths
    const shapes = SVGLoader.createShapes(paths[0])
    return new THREE.ExtrudeGeometry(shapes[0], {
      steps: mesh.args[0],
      depth: mesh.args[1],
      bevelEnabled: mesh.bevelEnabled,
      bevelThickness: mesh.args[2],
      bevelSize: mesh.args[3],
      bevelOffset: mesh.args[4],
      bevelSegments: mesh.args[5],
    })
  }, [mesh.d, mesh.args, mesh.bevelEnabled])

  return (
    <mesh position={position} rotation={rotation} scale={scale} visible={visible} geometry={geometry}>
      <meshStandardMaterial color={mesh.color} />
      {isSelected && <Outlines thickness={4} color="hotpink" />}
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
    return <PathMesh mesh={mesh} rotation={rotation} isSelected={isSelected} />
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
      {isSelected && <Outlines thickness={4} color="hotpink" />}
    </mesh>
  )
}
