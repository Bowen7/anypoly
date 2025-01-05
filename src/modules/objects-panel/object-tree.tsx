import { Tree } from 'react-arborist'
import { useSetAtom } from 'jotai'
import { useHover } from 'usehooks-ts'
import { useCallback, useEffect, useRef } from 'react'
import { ObjectNode } from './object-node'
import type { PolyObject } from '@/lib/types'
import { focusedObjectAtom, isObjectTreeHoverAtom, useMoveObject, useRemoveObject } from '@/lib'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

type Props = {
  data: PolyObject[]
  width: number
  height: number
}
export const ObjectTree = ({ data, width, height }: Props) => {
  const hoverRef = useRef<HTMLDivElement>(null)
  const setIsHover = useSetAtom(isObjectTreeHoverAtom)
  const isHover = useHover(hoverRef)
  const setFocusedObject = useSetAtom(focusedObjectAtom)
  const removeObject = useRemoveObject()
  const onMove = useMoveObject()

  useEffect(() => {
    setIsHover(isHover)
  }, [isHover, setIsHover])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setFocusedObject(null)
    } else if (e.key === 'Backspace') {
      if (e.target instanceof HTMLInputElement) {
        return
      }
      removeObject()
    }
  }, [setFocusedObject, removeObject])

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
        rowHeight={28}
        indent={16}
      >
        {ObjectNode}
      </Tree>
    </div>
  )
}
