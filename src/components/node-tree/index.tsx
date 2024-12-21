import { Tree } from 'react-arborist'
import { useSetAtom } from 'jotai'
import { useHover } from 'usehooks-ts'
import { useEffect, useRef } from 'react'
import type { NodeItem } from './node'
import { Node } from './node'
import { isHoverAtom } from './atom'

type Props = {
  data: NodeItem[]
  height: number
}
export const NodeTree = ({ data, height }: Props) => {
  const hoverRef = useRef<HTMLDivElement>(null)
  const setIsHover = useSetAtom(isHoverAtom)
  const isHover = useHover(hoverRef)

  useEffect(() => {
    setIsHover(isHover)
  }, [isHover, setIsHover])
  return (
    <div ref={hoverRef}>
      <Tree data={data} height={height}>
        {Node}
      </Tree>
    </div>
  )
}
