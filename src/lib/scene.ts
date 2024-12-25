import { useCallback } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import type { Mesh3D } from './types'
import { focusedIdAtom, focusedMeshAtom, meshesAtom } from './atom'

export const useMeshes = () => useAtomValue(meshesAtom)
export const useFocusedMesh = () => useAtomValue(focusedMeshAtom)

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

export const useRemoveMesh = () => {
  const setFocusedMesh = useSetAtom(focusedMeshAtom)
  const focusedId = useAtomValue(focusedIdAtom)
  const setMeshes = useSetAtom(meshesAtom)
  return useCallback(() => {
    if (!focusedId) {
      return
    }
    setMeshes((draft) => {
      visitMesh(draft, focusedId, (collection, index) => {
        collection.splice(index, 1)
      })
    })
    setFocusedMesh(null)
  }, [focusedId, setFocusedMesh, setMeshes])
}

export const useUpdateMesh = () => {
  const focusedId = useAtomValue(focusedIdAtom)
  const [focusedMesh, setFocusedMesh] = useAtom(focusedMeshAtom)
  const setMeshes = useSetAtom(meshesAtom)
  return useCallback(async (partial: Partial<Mesh3D>) => {
    if (!focusedMesh) {
      return
    }
    const mesh = { ...focusedMesh, ...partial } as Mesh3D
    setFocusedMesh(mesh)
    setMeshes((draft) => {
      visitMesh(draft, focusedId, (collection, index) => {
        collection[index] = mesh
      })
    })
  }, [focusedId, focusedMesh, setFocusedMesh, setMeshes])
}

export const useSetMeshVisible = () => {
  const setMeshes = useSetAtom(meshesAtom)
  return useCallback(async (id: string, visible: boolean) => {
    setMeshes((draft) => {
      visitMesh(draft, id, (collection, index) => {
        collection[index].visible = visible
      })
    })
  }, [setMeshes])
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
        args: [1, 16, 16, 0, 2, 0, 1],
      }
    case 'circle':
      return {
        ...mesh,
        type,
        color,
        args: [1, 16, 0, 2],
      }
    case 'cylinder':
      return {
        ...mesh,
        type,
        color,
        args: [1, 1, 1, 8, 1, false, 0, 2],
      }
    case 'cone':
      return {
        ...mesh,
        type,
        color,
        args: [1, 1, 8, 1, false, 0, 2],
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
        args: [12, 1, 1, true, 0.2, 0.1, 0, 3],
        color,
      }
    default:
      throw new Error(`Unknown mesh type: ${type}`)
  }
}

export const useCreateMesh = () => {
  const setMeshes = useSetAtom(meshesAtom)
  return useCallback((type: Mesh3D['type']) => {
    const mesh = createMesh(type)
    setMeshes((draft) => {
      draft.push(mesh)
    })
  }, [setMeshes])
}

const TEMP_GROUP = createMesh('group')

export const useMoveMesh = () => {
  const setMeshes = useSetAtom(meshesAtom)
  return useCallback(({ dragIds, parentId, index }: { dragIds: string[], parentId: string | null, index: number }) => {
    setMeshes((draft) => {
      const id = dragIds[0]
      if (!id) {
        return
      }
      let mesh: Mesh3D | null = null
      visitMesh(draft, id, (collection, index) => {
        mesh = collection[index]
        collection[index] = TEMP_GROUP
      })
      if (!mesh) {
        return
      }
      if (parentId === null) {
        draft.splice(index, 0, mesh)
      } else {
        visitMesh(draft, parentId, (collection, i) => {
          const group = collection[i]
          if (group.type === 'group') {
            group.children.splice(index, 0, mesh!)
          }
        })
      }
      visitMesh(draft, TEMP_GROUP.id, (collection, index) => {
        collection.splice(index, 1)
      })
    })
  }, [setMeshes])
}
