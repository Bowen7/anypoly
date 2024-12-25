import { Tree } from 'react-arborist'
import { useSetAtom } from 'jotai'
import { useHover } from 'usehooks-ts'
import { useCallback, useEffect, useRef } from 'react'
import { Node } from './node'
import type { Mesh3D } from '@/lib/types'
import { focusedMeshAtom, isMeshTreeHoverAtom, useMoveMesh, useRemoveMesh } from '@/lib'

type Props = {
  data: Mesh3D[]
  width: number
  height: number
}
export const MeshTree = ({ data, width, height }: Props) => {
  const hoverRef = useRef<HTMLDivElement>(null)
  const setIsHover = useSetAtom(isMeshTreeHoverAtom)
  const isHover = useHover(hoverRef)
  const setFocusedMesh = useSetAtom(focusedMeshAtom)
  const removeMesh = useRemoveMesh()
  const onMove = useMoveMesh()

  useEffect(() => {
    setIsHover(isHover)
  }, [isHover, setIsHover])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setFocusedMesh(null)
    } else if (e.key === 'Backspace') {
      // TODO: don't remove mesh when cursor is in the input
      removeMesh()
    }
  }, [setFocusedMesh, removeMesh])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])

  return (
    <div ref={hoverRef}>
      <Tree
        data={data}
        width={width}
        height={height}
        onMove={onMove}
        rowClassName="focus:outline-none"
      >
        {Node}
      </Tree>
    </div>
  )
}
