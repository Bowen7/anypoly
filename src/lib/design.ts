import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { designIdAtom, meshesAtom, sceneIdAtom } from './atom'
import { db } from './db'

export const useDesigns = () => useLiveQuery(() => {
  return db.designs.orderBy('lastSelected').reverse().toArray()
})

export const useUpdateDesignName = () => {
  const designId = useAtomValue(designIdAtom)
  return useCallback((name: string) => db.designs.update(designId, {
    name,
  }), [designId])
}

export const useDesign = () => {
  const designId = useAtomValue(designIdAtom)
  return useLiveQuery(() => {
    return db.designs.get(designId)
  }, [designId])
}

export const useSwitchDesign = () => {
  const setDesignId = useSetAtom(designIdAtom)
  const setSceneId = useSetAtom(sceneIdAtom)
  const setMeshes = useSetAtom(meshesAtom)
  return useCallback(async (id: number) => {
    await db.designs.update(id, {
      lastSelected: new Date(),
    })
    const scene = await db.scenes.where('design').equals(id).first()
    let sceneId = scene?.id
    if (!scene) {
      sceneId = await db.scenes.add({
        design: id,
        meshes: [],
        updated: new Date(),
      })
    }
    setDesignId(id)
    setSceneId(sceneId ?? -1)
    setMeshes(scene?.meshes ?? [])
  }, [setDesignId, setSceneId, setMeshes])
}

export const useSetLatestDesign = () => {
  const setDesignId = useSetAtom(designIdAtom)
  const switchDesign = useSwitchDesign()
  return useCallback(async () => {
    const design = await db.designs.orderBy('lastSelected').reverse().first()
    if (design) {
      setDesignId(design.id)
      await switchDesign(design.id)
    }
  }, [setDesignId, switchDesign])
}

export const useCreateDesign = () => {
  const setDesignId = useSetAtom(designIdAtom)
  const setSceneId = useSetAtom(sceneIdAtom)
  return useCallback(async (name: string) => {
    const id = await db.designs.add({
      name,
      lastSelected: new Date(),
    })
    const sceneId = await db.scenes.add({
      design: id,
      meshes: [],
      updated: new Date(),
    })
    setDesignId(id)
    setSceneId(sceneId)
  }, [setDesignId, setSceneId])
}

export const useRemoveDesign = () => {
  const [designId, setDesignId] = useAtom(designIdAtom)
  return useCallback(async () => {
    db.transaction('rw', db.designs, db.scenes, async () => {
      return Promise.all([
        db.designs.delete(designId),
        db.scenes.where('design').equals(designId).delete(),
      ])
    })
    setDesignId(-1)
  }, [designId, setDesignId])
}
