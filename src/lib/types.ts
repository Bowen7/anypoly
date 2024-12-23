export type BaseMesh3D = {
  id: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  visible: boolean
}

export type ShapeMesh3D = BaseMesh3D & {
  color: string
  type: 'box' | 'sphere' | 'circle' | 'cylinder' | 'cone' | 'plane'
  args: number[]
}

export type GroupMesh3D = BaseMesh3D & {
  type: 'group'
  children: Mesh3D[]
}

export type PathMesh3D = BaseMesh3D & {
  type: 'path'
  d: string
  color: string
  extrude: boolean
  bevelEnabled: boolean
  args: number[]
}

export type Mesh3D = ShapeMesh3D | GroupMesh3D | PathMesh3D

export type DesignModel = {
  id: number
  name: string
  meshes: Mesh3D[]
  created: Date
  updated: Date
}
