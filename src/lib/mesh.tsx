import { useMemo } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons'
import type { PolyMesh } from './types'

const loader = new SVGLoader()

export const useMeshGeometry = (mesh: PolyMesh) => {
  const { type, args } = mesh
  const d = type === 'path' ? mesh.d : ''
  const extrude = type === 'path' ? mesh.extrude : false
  return useMemo(() => {
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
}
