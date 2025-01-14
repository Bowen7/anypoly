import { useMemo } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { PathGeometry } from '@/lib/geometry/path-geometry'
import { ExtrudePathGeometry } from '@/lib/geometry/extrude-path-geometry'

const geometry = new ExtrudePathGeometry(
  [
    new THREE.Vector2(-0.5, -0.5),
    new THREE.Vector2(0.5, -0.5),
    new THREE.Vector2(1, 0),
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(-0.5, 0.5),
    new THREE.Vector2(-1, 0),
  ],
  1,
)

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
      <mesh geometry={geometry}>
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
      {/* <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
      </mesh> */}
    </>
  )
}
