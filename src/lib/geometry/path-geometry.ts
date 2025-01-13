import * as THREE from 'three'
import type {
  Vector2,
} from 'three'
import {
  Float32BufferAttribute,
  ShapeUtils,
} from 'three'

export class PathGeometry extends THREE.BufferGeometry {
  constructor(points: Vector2[]) {
    super()

    const length = points.length
    const vertices = new Float32Array(length * 3)
    const uv = new Float32Array(length * 2)
    const normals = new Float32Array(length * 3)
    const faces = ShapeUtils.triangulateShape(points, [])
    const indices = new Uint32Array(faces.length * 3)

    points.forEach((point, index) => {
      const [x, y] = point
      vertices[index * 3] = x
      vertices[index * 3 + 1] = y
      vertices[index * 3 + 2] = 0
      uv[index * 2] = x
      uv[index * 2 + 1] = y
      normals[index * 3] = 0
      normals[index * 3 + 1] = 0
      normals[index * 3 + 2] = 1
    })

    faces.forEach((face, index) => {
      const [a, b, c] = face
      indices[index * 3] = a
      indices[index * 3 + 1] = b
      indices[index * 3 + 2] = c
    })

    this.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    this.setAttribute('uv', new Float32BufferAttribute(uv, 2))
    this.setAttribute('normal', new Float32BufferAttribute(normals, 3))
    this.setIndex(new THREE.BufferAttribute(indices, 1))
  }
}
