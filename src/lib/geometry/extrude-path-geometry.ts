import type {
  Vector2,
} from 'three'
import {
  ShapeUtils,
} from 'three'
import { PolyGeometry } from './poly-geometry'

export class ExtrudePathGeometry extends PolyGeometry {
  constructor(points: Vector2[], depth: number) {
    const faces = ShapeUtils.triangulateShape(points, [])
    const size = points.length * 4
    const indexSize = faces.length * 6 + points.length * 3
    super({
      size,
      indexSize,
    })

    const buildLid = (isTop: boolean) => {
      const vi = this.vi

      points.forEach((point) => {
        const [x, y] = point
        this.vertex(x, y, isTop ? depth / 2 : -depth / 2, x, y, [0, 0, 1])
      })

      faces.forEach((face) => {
        this.face3(vi + face[0], vi + face[1], vi + face[2])
      })
    }

    buildLid(true)
    buildLid(false)

    const svi = this.vi
    // side faces
    points.forEach((point, index) => {
      const [x, y] = point
      const next = points[index + 1] || points[0]
      const [nx, ny] = next
      const vi = this.vi
      if (Math.abs(x - nx) < Math.abs(y - ny)) {
        this.vertex(x, y, depth / 2, y, depth / 2)
        this.vertex(x, y, -depth / 2, y, depth / 2)
      } else {
        this.vertex(x, y, depth / 2, x, depth / 2)
        this.vertex(x, y, -depth / 2, x, -depth / 2)
      }
      if (index === points.length - 1) {
        this.face4(vi, vi + 1, svi + 1, svi)
        const normal = this.calcNormal(vi, vi + 1, svi)
        this.setNormals(normal, vi, this.vi)
      } else {
        // this.face4(vi, vi + 1, vi + 3, vi + 2)
        // const normal = this.calcNormal(vi, vi + 1, vi + 2)
        // this.setNormals(normal, vi, this.vi)
      }
    })

    this.build()
  }
}
