import { useCallback } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import type { PolyObject } from './types'
import { focusedIdAtom, focusedObjectAtom, objectsAtom } from './atom'

export const useObjects = () => useAtomValue(objectsAtom)
export const useFocusedObject = () => useAtomValue(focusedObjectAtom)

export const visitObjects = (
  objects: PolyObject[],
  id: string,
  callback: (collection: PolyObject[], index: number) => void,
) => {
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]
    if (object.id === id) {
      callback(objects, i)
      return
    }
    if (object.type === 'group' && object.children) {
      visitObjects(object.children, id, callback)
    }
  }
}

export const useRemoveObject = () => {
  const setFocusedObject = useSetAtom(focusedObjectAtom)
  const focusedId = useAtomValue(focusedIdAtom)
  const setObjects = useSetAtom(objectsAtom)
  return useCallback(() => {
    if (!focusedId) {
      return
    }
    setObjects((draft) => {
      visitObjects(draft, focusedId, (collection, index) => {
        collection.splice(index, 1)
      })
    })
    setFocusedObject(null)
  }, [focusedId, setFocusedObject, setObjects])
}

export const useUpdateObject = () => {
  const focusedId = useAtomValue(focusedIdAtom)
  const [focusedObject, setFocusedObject] = useAtom(focusedObjectAtom)
  const setObjects = useSetAtom(objectsAtom)
  return useCallback(async (partial: Partial<PolyObject>) => {
    if (!focusedObject) {
      return
    }
    const object = { ...focusedObject, ...partial } as PolyObject
    setFocusedObject(object)
    setObjects((draft) => {
      visitObjects(draft, focusedId, (collection, index) => {
        collection[index] = object
      })
    })
  }, [focusedId, focusedObject, setFocusedObject, setObjects])
}

export const useSetObjectVisible = () => {
  const setObjects = useSetAtom(objectsAtom)
  return useCallback(async (id: string, visible: boolean) => {
    setObjects((draft) => {
      visitObjects(draft, id, (collection, index) => {
        collection[index].visible = visible
      })
    })
  }, [setObjects])
}

export const createObject = (type: PolyObject['type']): PolyObject => {
  const id = nanoid()
  const name = type.charAt(0).toUpperCase() + type.slice(1)
  const color = '#0ff0f0'
  const position: [number, number, number] = [0, 0, 0]
  const rotation: [number, number, number] = [0, 0, 0]
  const scale: [number, number, number] = [1, 1, 1]
  const object = {
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
        ...object,
        type,
        color,
        args: [1, 1, 1, 1, 1, 1],
      }
    case 'sphere':
      return {
        ...object,
        type,
        color,
        args: [1, 16, 16, 0, 2, 0, 1],
      }
    case 'circle':
      return {
        ...object,
        type,
        color,
        args: [1, 16, 0, 2],
      }
    case 'cylinder':
      return {
        ...object,
        type,
        color,
        args: [1, 1, 1, 8, 1, false, 0, 2],
      }
    case 'cone':
      return {
        ...object,
        type,
        color,
        args: [1, 1, 8, 1, false, 0, 2],
      }
    case 'plane':
      return {
        ...object,
        type,
        color,
        args: [1, 1, 1, 1],
      }
    case 'group':
      return {
        ...object,
        type,
        children: [],
      }
    case 'path':
      return {
        ...object,
        type,
        d: 'M 0 2 v -2 h 2 a 1 1 0.9 0 1 0 2 a 1 1 0.9 0 1 -2 0 z',
        extrude: false,
        args: [12, 1, 1, true, 0.2, 0.1, 0, 3],
        color,
      }
    default:
      throw new Error(`Unknown object type: ${type}`)
  }
}

export const useCreateObject = () => {
  const setObjects = useSetAtom(objectsAtom)
  return useCallback((type: PolyObject['type']) => {
    const object = createObject(type)
    setObjects((draft) => {
      draft.push(object)
    })
  }, [setObjects])
}

const TEMP_GROUP = createObject('group')

export const useMoveObject = () => {
  const setObjects = useSetAtom(objectsAtom)
  return useCallback(({ dragIds, parentId, index }: { dragIds: string[], parentId: string | null, index: number }) => {
    setObjects((draft) => {
      const id = dragIds[0]
      if (!id) {
        return
      }
      let object: PolyObject | null = null
      visitObjects(draft, id, (collection, index) => {
        object = collection[index]
        collection[index] = TEMP_GROUP
      })
      if (!object) {
        return
      }
      if (parentId === null) {
        draft.splice(index, 0, object)
      } else {
        visitObjects(draft, parentId, (collection, i) => {
          const group = collection[i]
          if (group.type === 'group') {
            group.children.splice(index, 0, object!)
          }
        })
      }
      visitObjects(draft, TEMP_GROUP.id, (collection, index) => {
        collection.splice(index, 1)
      })
    })
  }, [setObjects])
}
