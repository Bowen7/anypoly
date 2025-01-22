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
    const size = points.length * 6
    const indexSize = faces.length * 6 + points.length
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

    // side faces
    points.forEach((point, index) => {
      const [x, y] = point
      const next = points[index + 1] || points[0]
      const [nx, ny] = next
      const vi = this.vi
      let u = x
      let nu = nx
      if (Math.abs(x - nx) < Math.abs(y - ny)) {
        u = y
        nu = ny
      }

      this.vertex(x, y, depth / 2, u, depth / 2)
      this.vertex(nx, ny, depth / 2, nu, depth / 2)
      this.vertex(nx, ny, -depth / 2, nu, -depth / 2)
      this.vertex(x, y, -depth / 2, u, -depth / 2)
      this.face4(vi, vi + 1, vi + 2, vi + 3)
      const normal = this.calcNormal(vi, vi + 1, vi + 2)
      this.setNormals(normal, vi, this.vi)
    })

    this.build()
    this.center()
  }
}
