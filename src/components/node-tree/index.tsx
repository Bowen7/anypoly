import { Tree } from 'react-arborist'
import { useSetAtom } from 'jotai'
import { useHover } from 'usehooks-ts'
import { useCallback, useEffect, useRef } from 'react'
import { produce } from 'immer'
import { Node } from './node'
import type { Mesh3D } from '@/lib/types'
import { useRemoveMesh, useUpdateMeshes } from '@/lib/db'
import { isNodeTreeHoverAtom, selectedAtom } from '@/lib/atom'
import { createMesh, visitMesh } from '@/lib/utils'

const tempGroup = createMesh('group')

type Props = {
  data: Mesh3D[]
  height: number
}
export const NodeTree = ({ data, height }: Props) => {
  const hoverRef = useRef<HTMLDivElement>(null)
  const setIsHover = useSetAtom(isNodeTreeHoverAtom)
  const isHover = useHover(hoverRef)
  const setSelectedId = useSetAtom(selectedAtom)
  const removeMesh = useRemoveMesh()
  const updateMeshes = useUpdateMeshes()

  useEffect(() => {
    setIsHover(isHover)
  }, [isHover, setIsHover])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedId(null)
    } else if (e.key === 'Backspace') {
      removeMesh()
    }
  }, [setSelectedId, removeMesh])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])

  const onMove = useCallback((
    { dragIds, parentId, index }: { dragIds: string[], parentId: string | null, index: number }) => {
    const meshes = produce(data, (draft) => {
      const id = dragIds[0]
      if (!id) {
        return
      }
      let mesh: Mesh3D | null = null
      visitMesh(draft, id, (collection, index) => {
        mesh = collection[index]
        collection[index] = tempGroup
      })
      if (!mesh) {
        return
      }
      if (parentId === null) {
        draft.splice(index, 0, mesh)
      } else {
        visitMesh(draft, parentId, (collection, i) => {
          const group = collection[i]
          group.children?.splice(index, 0, mesh!)
        })
      }
      visitMesh(draft, tempGroup.id, (collection, index) => {
        collection.splice(index, 1)
      })
    })
    updateMeshes(meshes)
  }, [data, updateMeshes])

  return (
    <div ref={hoverRef}>
      <Tree data={data} height={height} onMove={onMove}>
        {Node}
      </Tree>
    </div>
  )
}
