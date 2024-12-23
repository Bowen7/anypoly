import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { produce } from 'immer'
import { nanoid } from 'nanoid'
import type { Mesh3D } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const visitMesh = (
  meshes: Mesh3D[],
  id: string,
  callback: (collection: Mesh3D[], index: number) => void,
) => {
  for (let i = 0; i < meshes.length; i++) {
    const mesh = meshes[i]
    if (mesh.id === id) {
      callback(meshes, i)
      return
    }
    if (mesh.type === 'group' && mesh.children) {
      visitMesh(mesh.children, id, callback)
    }
  }
}

export const removeMesh = (meshes: Mesh3D[], id: string) => {
  return produce(meshes, (draft) => {
    visitMesh(draft, id, (collection, index) => {
      collection.splice(index, 1)
    })
  })
}

export const updateMesh = (meshes: Mesh3D[], id: string, partial: Partial<Mesh3D>) => {
  return produce(meshes, (draft) => {
    visitMesh(draft, id, (collection, index) => {
      collection[index] = { ...collection[index], ...partial } as Mesh3D
    })
  })
}

export const createMesh = (type: Mesh3D['type']): Mesh3D => {
  const id = nanoid()
  const name = type.charAt(0).toUpperCase() + type.slice(1)
  const color = '#0ff0f0'
  const position: [number, number, number] = [0, 0, 0]
  const rotation: [number, number, number] = [0, 0, 0]
  const scale: [number, number, number] = [1, 1, 1]
  const mesh = {
    id,
    name,
    position,
    rotation,
    scale,
    visible: true,
  }
  switch (type) {
    case 'box':
      return {
        ...mesh,
        type,
        color,
        args: [1, 1, 1, 1, 1, 1],
      }
    case 'sphere':
      return {
        ...mesh,
        type,
        color,
        args: [1, 16, 16],
      }
    case 'circle':
      return {
        ...mesh,
        type,
        color,
        args: [1, 16],
      }
    case 'cylinder':
      return {
        ...mesh,
        type,
        color,
        args: [1, 1, 1, 8, 1],
      }
    case 'cone':
      return {
        ...mesh,
        type,
        color,
        args: [1, 1, 8, 1],
      }
    case 'plane':
      return {
        ...mesh,
        type,
        color,
        args: [1, 1, 1, 1],
      }
    case 'group':
      return {
        ...mesh,
        type,
        children: [],
      }
    case 'path':
      return {
        ...mesh,
        type,
        d: 'M 0 2 v -2 h 2 a 1 1 0.9 0 1 0 2 a 1 1 0.9 0 1 -2 0 z',
        extrude: false,
        bevelEnabled: false,
        args: [12, 2, 5, 1, 1, 0, 1],
        color,
      }
    default:
      throw new Error(`Unknown mesh type: ${type}`)
  }
}
