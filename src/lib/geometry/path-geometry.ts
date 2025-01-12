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

    const verticesArray: number[] = []
    const uvArray: number[] = []
    const normalsArray: number[] = []

    const faces = ShapeUtils.triangulateShape(points, [])

    const addVertex = (index: number) => {
      const [x, y] = points[index]
      verticesArray.push(x, y, 0)
      uvArray.push(x, y)
      normalsArray.push(0, 0, 1)
    }

    faces.forEach((face) => {
      const [a, b, c] = face
      addVertex(a)
      addVertex(b)
      addVertex(c)
    })

    this.setAttribute('position', new Float32BufferAttribute(verticesArray, 3))
    this.setAttribute('uv', new Float32BufferAttribute(uvArray, 2))
    this.setAttribute('normal', new Float32BufferAttribute(normalsArray, 3))
  }
}
