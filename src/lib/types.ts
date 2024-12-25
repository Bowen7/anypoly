export type BaseMesh3D = {
  id: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  visible: boolean
}

export type BoxMesh3D = BaseMesh3D & {
  color: string
  type: 'box'
  args: [number, number, number, number, number, number]
}
export type SphereMesh3D = BaseMesh3D & {
  color: string
  type: 'sphere'
  args: [number, number, number, number, number, number, number]
}
export type CircleMesh3D = BaseMesh3D & {
  color: string
  type: 'circle'
  args: [number, number, number, number]
}
export type CylinderMesh3D = BaseMesh3D & {
  color: string
  type: 'cylinder'
  args: [number, number, number, number, number, boolean, number, number]
}
export type ConeMesh3D = BaseMesh3D & {
  color: string
  type: 'cone'
  args: [number, number, number, number, boolean, number, number]
}
export type PlaneMesh3D = BaseMesh3D & {
  color: string
  type: 'plane'
  args: [number, number, number, number]
}

export type ShapeMesh3D = BoxMesh3D | SphereMesh3D | CircleMesh3D | CylinderMesh3D | ConeMesh3D | PlaneMesh3D

export type GroupMesh3D = BaseMesh3D & {
  type: 'group'
  children: Mesh3D[]
}

export type PathMesh3D = BaseMesh3D & {
  type: 'path'
  d: string
  color: string
  extrude: boolean
  args: [number, number, number, boolean, number, number, number, number]
}

export type Mesh3D = ShapeMesh3D | GroupMesh3D | PathMesh3D

export type DesignModel = {
  id: number
  name: string
  lastSelected: Date
}

export type SceneModel = {
  id: number
  design: number
  meshes: Mesh3D[]
  updated: Date
}
