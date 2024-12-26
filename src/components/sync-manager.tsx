import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import debounce from 'lodash-es/debounce'
import { db } from '@/lib/db'
import { designIdAtom, objectsAtom, sceneIdAtom, useSetLatestDesign } from '@/lib'
import type { PolyObject } from '@/lib/types'

const debouncedSyncObjects = debounce((sceneId: number, objects: PolyObject[]) => {
  // @ts-ignore
  db.scenes.update(sceneId, {
    objects,
    updated: new Date(),
  })
}, 1000)

export const SyncManager = () => {
  const objects = useAtomValue(objectsAtom)
  const sceneId = useAtomValue(sceneIdAtom)
  const designId = useAtomValue(designIdAtom)
  const setLatestDesign = useSetLatestDesign()
  const prevSceneId = useRef(sceneId)

  useEffect(() => {
    if (prevSceneId.current !== sceneId) {
      prevSceneId.current = sceneId
    } else {
      debouncedSyncObjects(sceneId, objects)
    }
  }, [objects, sceneId])

  useEffect(() => {
    if (designId === -1) {
      setLatestDesign()
    }
  }, [setLatestDesign, designId])

  return null
}
