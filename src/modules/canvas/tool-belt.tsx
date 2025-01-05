import {
  Circle as CircleIcon,
  Cube as CubeIcon,
  Cylinder as CylinderIcon,
  RectangleDashed as RectangleDashedIcon,
  Rectangle as RectangleIcon,
  Shapes as ShapesIcon,
  Sphere as SphereIcon,
  Square as SquareIcon,
  VectorThree as VectorThreeIcon,
  VectorTwo as VectorTwoIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCreateObject, useDesign } from '@/lib'

export const ToolBelt = () => {
  const design = useDesign()
  const createObject = useCreateObject()
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 shadow p-2 space-x-1 rounded-lg bg-white select-none">
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => createObject('group')}>
        <RectangleDashedIcon />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-7 h-7 focus-visible:none" disabled={!design}>
            <VectorTwoIcon weight="duotone" className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => createObject('plane')}>
            <SquareIcon weight="duotone" />
            {' '}
            Plane
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => createObject('circle')}>
            <CircleIcon weight="duotone" />
            {' '}
            Circle
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-7 h-7 focus-visible:ring-0" disabled={!design}>
            <VectorThreeIcon weight="duotone" className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => createObject('box')}>
            <CubeIcon weight="duotone" />
            {' '}
            Box
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => createObject('sphere')}>
            <SphereIcon weight="duotone" />
            {' '}
            Sphere
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => createObject('cylinder')}>
            <CylinderIcon weight="duotone" />
            {' '}
            Cylinder
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RectangleIcon weight="bold" />
            {' '}
            Border
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => createObject('path')}>
        <ShapesIcon />
      </Button>
    </div>
  )
}
