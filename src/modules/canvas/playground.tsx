import { useMemo } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { SVGLoader } from 'three/addons'
import { californiaShape, fishShape, heartShape } from './shapes'
import { PathGeometry } from '@/lib/geometry/path-geometry'
import { ExtrudePathGeometry } from '@/lib/geometry/extrude-path-geometry'

const loader = new SVGLoader()

const d = 'M 0 2 v -2 h 2 a 1 1 0.9 0 1 0 2 a 1 1 0.9 0 1 -2 0 z'
const paths = loader.parse(`<path d="${d}" />`).paths

const shapes = SVGLoader.createShapes(paths[0])
const shapePoints = shapes[0].extractPoints(12)

const geometry = new ExtrudePathGeometry(
  shapePoints.shape,
  2,
)

const extrudeOptions = {
  depth: 8,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 2,
  bevelSize: 1,
  bevelThickness: 1,
}

export const Playground = () => {
  const _texture = useTexture(
    'https://pub-8813d4e0ea594260a0b7d4a842c0d6f7.r2.dev/wood1.jpg',
  )
  const texture = useMemo(() => {
    _texture.wrapS = THREE.RepeatWrapping
    _texture.wrapT = THREE.RepeatWrapping
    _texture.needsUpdate = true
    return _texture
  }, [_texture])

  return (
    <>
      {/* <mesh geometry={geometry}>
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} wireframe />
      </mesh> */}
      <mesh scale={0.1} position={[0, 6, 0]} rotation={[Math.PI, 0, 0]}>
        <extrudeGeometry args={[heartShape, extrudeOptions]} />
        <meshStandardMaterial color={0xF00000} side={THREE.DoubleSide} />
      </mesh>
      <mesh scale={0.075} position={[-15, -10, 0]}>
        <extrudeGeometry args={[californiaShape, extrudeOptions]} />
        <meshStandardMaterial color={0xF000F0} side={THREE.DoubleSide} />
      </mesh>
      <mesh scale={0.075} position={[-9, 10, 0]}>
        <extrudeGeometry args={[fishShape, extrudeOptions]} />
        <meshStandardMaterial color={0xF08000} side={THREE.DoubleSide} />
      </mesh>
      {/* <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
      </mesh> */}
    </>
  )
}
