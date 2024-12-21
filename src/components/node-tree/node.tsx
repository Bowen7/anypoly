import { memo } from 'react'
import type { NodeRendererProps } from 'react-arborist'
import { useAtomValue } from 'jotai'
import { CaretRight as CaretRightIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import { isHoverAtom } from './atom'

export type NodeItem = {
  name: string
  id: string
  children?: NodeItem[]
}

export const Node = memo((props: NodeRendererProps<NodeItem>) => {
  const { node, style, dragHandle } = props
  const { data, isLeaf, isOpen } = node
  const isHover = useAtomValue(isHoverAtom)

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    node.toggle()
  }
  return (
    <div style={style} ref={dragHandle} className="flex items-center gap-2">
      {isLeaf ? null : <CaretRightIcon className={clsx({ 'rotate-90': isOpen, 'invisible': !isHover })} onClick={onClick} />}
      {data.name}
    </div>
  )
})
