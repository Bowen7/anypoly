export type N3 = [number, number, number]
export type BaseObject = {
  id: string
  name: string
  position: N3
  rotation: N3
  scale: N3
  visible: boolean
}

export type CSGOperation = '' | 'add' | 'subtract' | 'intersect' | 'reverseSubtract' | 'diff'

export type BaseShapeObject = BaseObject & {
  color: string
  csgEnabled: boolean
  csgOperation: CSGOperation
  children: PolyShapeMesh[]
}

export type PolyBoxMesh = BaseShapeObject & {
  type: 'box'
  args: [number, number, number, number, number]
}
export type PolySphereMesh = BaseShapeObject & {
  type: 'sphere'
  args: [number, number, number, number, number, number, number]
}
export type PolyCircleMesh = BaseShapeObject & {
  type: 'circle'
  args: [number, number, number, number]
}
export type PolyCylinderMesh = BaseShapeObject & {
  type: 'cylinder'
  args: [number, number, number, number, number, boolean, number, number]
}
export type PolyConeMesh = BaseShapeObject & {
  type: 'cone'
  args: [number, number, number, number, boolean, number, number]
}
export type PolyPlaneMesh = BaseShapeObject & {
  type: 'plane'
  args: [number, number, number, number]
}

export type PolyShapeMesh = PolyBoxMesh | PolySphereMesh | PolyCircleMesh | PolyCylinderMesh | PolyConeMesh | PolyPlaneMesh

export type PolyGroup = BaseObject & {
  type: 'group'
  children: PolyObject[]
}

export type PolyPathMesh = BaseShapeObject & {
  type: 'path'
  d: string
  extrude: boolean
  args: [number, number, number, boolean, number, number, number, number]
}

export type PolyObject = PolyShapeMesh | PolyGroup | PolyPathMesh
export type PolyMesh = PolyShapeMesh | PolyPathMesh

export type PolyNumberArg = {
  type: 'number'
  value: number
  min?: number
  max?: number
}
export type PolyBooleanArg = {
  type: 'boolean'
  value: boolean
}
export type PolyColorArg = {
  type: 'color'
  value: string
}
export type PolyArg = PolyNumberArg | PolyBooleanArg | PolyColorArg

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

export const isShapeMesh = (object: PolyObject): object is PolyShapeMesh => {
  return object.type === 'box'
    || object.type === 'sphere'
    || object.type === 'circle'
    || object.type === 'cylinder'
    || object.type === 'cone'
    || object.type === 'plane'
}
