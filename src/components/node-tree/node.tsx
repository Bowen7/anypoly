import { memo } from 'react'
import type { NodeRendererProps } from 'react-arborist'
import { useAtom, useAtomValue } from 'jotai'
import { CaretRight as CaretRightIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import { isNodeTreeHoverAtom, selectedAtom } from '@/lib/atom'
import type { Mesh3D } from '@/lib/types'

export const Node = memo((props: NodeRendererProps<Mesh3D>) => {
  const { node, style, dragHandle } = props
  const { data, isLeaf, isOpen } = node
  const isHover = useAtomValue(isNodeTreeHoverAtom)
  const [selectedId, setSelectedId] = useAtom(selectedAtom)

  const isSelected = selectedId === data.id

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    node.toggle()
  }
  return (
    <div style={style} ref={dragHandle} className="flex items-center gap-2">
      <span className={clsx('text-sm', { 'text-blue-500': isSelected })} onClick={() => setSelectedId(data.id)}>{data.name}</span>
      {isLeaf ? null : <CaretRightIcon className={clsx({ 'rotate-90': isOpen, 'invisible': !isHover })} onClick={onClick} />}
    </div>
  )
})
