import { useCallback, useMemo } from 'react'
import { Dexie } from 'dexie'
import type { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAtomValue, useSetAtom } from 'jotai'
import type { DesignModel, Mesh3D } from './types'
import { designAtom, selectedAtom } from './atom'
import { removeMesh, updateMesh, visitMesh } from './utils'

const db = new Dexie('AnypolyDB') as Dexie & {
  designs: EntityTable<DesignModel, 'id'>
}

db.version(1).stores({
  designs: '++id, created, updated',
})

export const useDesigns = () => {
  const designs = useLiveQuery(async () => {
    return db.designs.orderBy('updated').reverse().toArray()
  })

  return designs || []
}

export const useDesign = () => useAtomValue(designAtom)

export const useUpdateDesignName = () => {
  const design = useDesign()
  return useCallback(async (name: string) => {
    if (!design) {
      return
    }
    await db.designs.update(design.id, {
      name,
      updated: new Date(),
    })
  }, [design])
}

export const useUpdateMeshes = () => {
  const design = useDesign()
  return useCallback(async (meshes: Mesh3D[]) => {
    if (!design) {
      return
    }
    await db.designs.update(design.id, {
      // Type assertion to avoid circular reference error
      meshes: meshes as any,
      updated: new Date(),
    })
  }, [design])
}

export const useCreateDesign = () => {
  const setDesign = useSetAtom(designAtom)
  return useCallback(async (name: string) => {
    const id = await db.designs.add({
      name,
      created: new Date(),
      updated: new Date(),
      meshes: [],
    })
    const design = await db.designs.get(id)
    setDesign(design!)
  }, [setDesign])
}

export const useRemoveMesh = () => {
  const design = useDesign()
  const selected = useAtomValue(selectedAtom)
  const updateDesignMeshes = useUpdateMeshes()
  return useCallback(async () => {
    if (!design || !selected) {
      return
    }
    const meshes = removeMesh(design.meshes, selected)
    await updateDesignMeshes(meshes)
  }, [design, selected, updateDesignMeshes])
}

export const useMesh = () => {
  const design = useDesign()
  const selected = useAtomValue(selectedAtom)
  return useMemo<Mesh3D | null>(() => {
    if (!design || !selected) {
      return null
    }
    let mesh: Mesh3D | null = null
    visitMesh(design.meshes, selected, (meshes, index) => {
      mesh = meshes[index]
    })
    return mesh
  }, [design, selected])
}

export const useUpdateMesh = () => {
  const design = useDesign()
  const selected = useAtomValue(selectedAtom)
  const updateDesignMeshes = useUpdateMeshes()
  return useCallback(async (partial: Partial<Mesh3D>) => {
    if (!design || !selected) {
      return
    }
    const meshes = updateMesh(design.meshes, selected, partial)
    await updateDesignMeshes(meshes)
  }, [design, selected, updateDesignMeshes])
}
