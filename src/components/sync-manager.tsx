import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import debounce from 'lodash-es/debounce'
import { db } from '@/lib/db'
import { meshesAtom, sceneIdAtom } from '@/lib/atom'
import type { Mesh3D } from '@/lib/types'

const debouncedSyncMeshes = debounce((sceneId: number, meshes: Mesh3D[]) => {
  // @ts-ignore
  db.scenes.update(sceneId, {
    meshes,
    updated: new Date(),
  })
}, 1000)

export const SyncManager = () => {
  const meshes = useAtomValue(meshesAtom)
  const sceneId = useAtomValue(sceneIdAtom)
  const prevSceneId = useRef(sceneId)

  useEffect(() => {
    if (prevSceneId.current !== sceneId) {
      prevSceneId.current = sceneId
    } else {
      debouncedSyncMeshes(sceneId, meshes)
    }
  }, [meshes, sceneId])

  return null
}
