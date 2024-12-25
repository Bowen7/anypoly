import { memo } from 'react'
import type { NodeRendererProps } from 'react-arborist'
import { useAtomValue, useSetAtom } from 'jotai'
import { CaretRight as CaretRightIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import { focusedIdAtom, focusedMeshAtom, isMeshTreeHoverAtom } from '@/lib/atom'
import type { Mesh3D } from '@/lib/types'

export const Node = memo((props: NodeRendererProps<Mesh3D>) => {
  const { node, style, dragHandle } = props
  const { data, isLeaf, isOpen } = node
  const isHover = useAtomValue(isMeshTreeHoverAtom)
  const focusedId = useAtomValue(focusedIdAtom)
  const setFocusedMesh = useSetAtom(focusedMeshAtom)

  const isSelected = focusedId === data.id

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    node.toggle()
  }
  return (
    <div
      style={style}
      ref={dragHandle}
      className={clsx('flex items-center gap-2 py-1 pr-2 rounded-md focus:outline-none hover:bg-secondary hover:text-secondary-foreground', { 'bg-secondary text-secondary-foreground': isSelected })}
      onClick={() => setFocusedMesh(data)}
    >
      <span className={clsx('text-sm pl-2')}>{data.name}</span>
      {isLeaf ? null : <CaretRightIcon className={clsx({ 'rotate-90': isOpen, 'invisible': !isHover })} onClick={onClick} />}
    </div>
  )
})
