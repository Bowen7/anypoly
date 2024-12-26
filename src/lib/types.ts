export type BaseObject = {
  id: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  visible: boolean
}

export type PolyBoxMesh = BaseObject & {
  color: string
  type: 'box'
  args: [number, number, number, number, number, number]
}
export type PolySphereMesh = BaseObject & {
  color: string
  type: 'sphere'
  args: [number, number, number, number, number, number, number]
}
export type PolyCircleMesh = BaseObject & {
  color: string
  type: 'circle'
  args: [number, number, number, number]
}
export type PolyCylinderMesh = BaseObject & {
  color: string
  type: 'cylinder'
  args: [number, number, number, number, number, boolean, number, number]
}
export type PolyConeMesh = BaseObject & {
  color: string
  type: 'cone'
  args: [number, number, number, number, boolean, number, number]
}
export type PolyPlaneMesh = BaseObject & {
  color: string
  type: 'plane'
  args: [number, number, number, number]
}

export type PolyShapeMesh = PolyBoxMesh | PolySphereMesh | PolyCircleMesh | PolyCylinderMesh | PolyConeMesh | PolyPlaneMesh

export type PolyGroup = BaseObject & {
  type: 'group'
  children: PolyObject[]
}

export type PolyPathMesh = BaseObject & {
  type: 'path'
  d: string
  color: string
  extrude: boolean
  args: [number, number, number, boolean, number, number, number, number]
}

export type PolyObject = PolyShapeMesh | PolyGroup | PolyPathMesh
export type PolyMesh = PolyShapeMesh | PolyPathMesh

export type DesignModel = {
  id: number
  name: string
  lastSelected: Date
}

export type SceneModel = {
  id: number
  design: number
  objects: PolyObject[]
  updated: Date
}
