import * as THREE from 'three'
import {
  Float32BufferAttribute,
} from 'three'

type Options = {
  size: number
  indexSize: number
}

const pA = new THREE.Vector3()
const pB = new THREE.Vector3()
const pC = new THREE.Vector3()
const nA = new THREE.Vector3()
const nB = new THREE.Vector3()
const nC = new THREE.Vector3()
const cb = new THREE.Vector3()
const ab = new THREE.Vector3()

export class PolyGeometry extends THREE.BufferGeometry {
  vertices: Float32Array
  uvs: Float32Array
  normals: Float32Array
  indices: Uint32Array
  options: Options
  vi = 0
  ii = 0

  constructor(options: Options) {
    super()

    this.options = options
    const {
      size,
      indexSize,
    } = options

    this.vertices = new Float32Array(size * 3)
    this.uvs = new Float32Array(size * 2)
    this.normals = new Float32Array(size * 3)
    this.indices = new Uint32Array(indexSize * 3)
  }

  vertex(x: number, y: number, z: number, u: number, v: number, normal?: [number, number, number]) {
    this.vertices[this.vi * 3] = x
    this.vertices[this.vi * 3 + 1] = y
    this.vertices[this.vi * 3 + 2] = z
    this.uvs[this.vi * 2] = u
    this.uvs[this.vi * 2 + 1] = v
    if (normal) {
      this.normals[this.vi * 3] = normal[0]
      this.normals[this.vi * 3 + 1] = normal[1]
      this.normals[this.vi * 3 + 2] = normal[2]
    }
    this.vi += 1
  }

  setUv(index: number, v: THREE.Vector2) {
    this.uvs[index * 2] = v.x
    this.uvs[index * 2 + 1] = v.y
  }

  face3(a: number, b: number, c: number) {
    this.indices[this.ii * 3] = a
    this.indices[this.ii * 3 + 1] = b
    this.indices[this.ii * 3 + 2] = c
    this.ii += 1
  }

  face4(a: number, b: number, c: number, d: number) {
    this.indices[this.ii * 3] = a
    this.indices[this.ii * 3 + 1] = b
    this.indices[this.ii * 3 + 2] = c
    this.indices[this.ii * 3 + 3] = a
    this.indices[this.ii * 3 + 4] = c
    this.indices[this.ii * 3 + 5] = d
    this.ii += 2
  }

  getPosition(v: THREE.Vector3, index: number) {
    v.x = this.vertices[index * 3]
    v.y = this.vertices[index * 3 + 1]
    v.z = this.vertices[index * 3 + 2]
    return v
  }

  getNormal(v: THREE.Vector3, index: number) {
    v.x = this.normals[index * 3]
    v.y = this.normals[index * 3 + 1]
    v.z = this.normals[index * 3 + 2]
    return v
  }

  setNormal(index: number, v: THREE.Vector3) {
    this.normals[index * 3] = v.x
    this.normals[index * 3 + 1] = v.y
    this.normals[index * 3 + 2] = v.z
  }

  setNormals(v: THREE.Vector3, start: number, end: number) {
    for (let i = start; i < end; i++) {
      this.setNormal(i, v)
    }
  }

  calcNormal(a: number, b: number, c: number) {
    this.getPosition(pA, a)
    this.getPosition(pB, b)
    this.getPosition(pC, c)

    cb.subVectors(pC, pB)
    ab.subVectors(pA, pB)
    cb.cross(ab)
    return cb
  }

  calcNormals(start: number, end: number) {
    for (let i = start; i < end; i += 3) {
      const vA = this.indices[i]
      const vB = this.indices[i + 1]
      const vC = this.indices[i + 2]

      this.getPosition(pA, vA)
      this.getPosition(pB, vB)
      this.getPosition(pC, vC)

      cb.subVectors(pC, pB)
      ab.subVectors(pA, pB)
      cb.cross(ab)

      this.getNormal(nA, vA)
      this.getNormal(nB, vB)
      this.getNormal(nC, vC)

      nA.add(cb)
      nB.add(cb)
      nC.add(cb)

      this.setNormal(vA, nA)
      this.setNormal(vB, nB)
      this.setNormal(vC, nC)
    }
  }

  build() {
    this.setAttribute('position', new Float32BufferAttribute(this.vertices, 3))
    this.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))
    this.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
    this.setIndex(new THREE.BufferAttribute(this.indices, 1))
  }
}
