import type {
  Vector2,
} from 'three'
import {
  ShapeUtils,
} from 'three'
import { PolyGeometry } from './poly-geometry'

export class PathGeometry extends PolyGeometry {
  constructor(points: Vector2[]) {
    const faces = ShapeUtils.triangulateShape(points, [])
    super({
      size: points.length,
      indexSize: faces.length * 3,
    })

    points.forEach((point) => {
      const [x, y] = point
      this.vertex(x, y, 0, x, y, [0, 0, 1])
    })

    faces.forEach((face) => {
      this.face3(face[0], face[1], face[2])
    })

    this.build()
  }
}
