import { memo, useMemo } from 'react'
import type { NodeRendererProps } from 'react-arborist'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  CaretRight as CaretRightIcon,
  Circle as CircleIcon,
  Cube as CubeIcon,
  Cylinder as CylinderIcon,
  Eye as EyeIcon,
  EyeSlash as EyeSlashIcon,
  Path as PathIcon,
  RectangleDashed as RectangleDashedIcon,
  Sphere as SphereIcon,
  Square as SquareIcon,
} from '@phosphor-icons/react'
import clsx from 'clsx'
import { focusedIdAtom, focusedObjectAtom, isObjectTreeHoverAtom, useSetObjectVisible } from '@/lib'
import type { PolyObject } from '@/lib/types'

export const ObjectNode = memo((props: NodeRendererProps<PolyObject>) => {
  const { node, style, dragHandle } = props
  const { data, isLeaf, isOpen } = node
  const { visible } = data
  const isHover = useAtomValue(isObjectTreeHoverAtom)
  const focusedId = useAtomValue(focusedIdAtom)
  const setFocusedObject = useSetAtom(focusedObjectAtom)
  const setObjectVisible = useSetObjectVisible()

  const isSelected = focusedId === data.id

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    node.toggle()
  }

  const onEyeClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    setObjectVisible(data.id, !data.visible)
  }

  const icon = useMemo(() => {
    switch (data.type) {
      case 'group':
        return <RectangleDashedIcon className="w-3.5 h-3.5 mr-0.5" />
      case 'plane':
        return <SquareIcon className="w-3.5 h-3.5 mr-0.5" />
      case 'circle':
        return <CircleIcon className="w-3.5 h-3.5 mr-0.5" />
      case 'box':
        return <CubeIcon className="w-3.5 h-3.5 mr-0.5" />
      case 'sphere':
        return <SphereIcon className="w-3.5 h-3.5 mr-0.5" />
      case 'path':
        return <PathIcon className="w-4 h-4 mr-0.5" />
      case 'cylinder':
        return <CylinderIcon className="w-3.5 h-3.5 mr-0.5" />
      default:
        return null
    }
  }, [data.type])
  return (
    <div
      style={style}
      ref={dragHandle}
      className={clsx('flex focus:outline-none py-0.5', { 'text-muted-foreground': !visible, 'text-secondary-foreground': isSelected && visible, 'hover:text-secondary-foreground': visible })}
      onClick={() => setFocusedObject(data)}
    >
      <div className={clsx('flex items-center flex-1 py-0.5 rounded-md group justify-between pr-2', { 'bg-secondary': isSelected, 'hover:bg-secondary': !isSelected })}>
        <div className="flex items-center">
          {isLeaf ? <span className="w-4 h-4" /> : <CaretRightIcon className={clsx({ 'rotate-90': isOpen, 'invisible': !isHover })} onClick={onClick} />}
          {icon}
          <span className={clsx('text-sm pl-0.5')}>{data.name}</span>
        </div>
        {visible ? <EyeIcon className="invisible group-hover:visible w-3.5 h-3.5 ml-1" onClick={onEyeClick} /> : <EyeSlashIcon className="w-3.5 h-3.5 ml-1" onClick={onEyeClick} />}
      </div>
    </div>
  )
})
