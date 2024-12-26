import {
  Circle as CircleIcon,
  Cube as CubeIcon,
  Cylinder as CylinderIcon,
  DotsThree as DotsThreeIcon,
  Path as PathIcon,
  RectangleDashed as RectangleDashedIcon,
  Sphere as SphereIcon,
  Square as SquareIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCreateObject, useDesign } from '@/lib'

export const FloatBar = () => {
  const design = useDesign()
  const createObject = useCreateObject()
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 shadow p-2 rounded-lg bg-white select-none">
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => createObject('group')}>
        <RectangleDashedIcon />
      </Button>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => createObject('plane')}>
        <SquareIcon />
      </Button>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => createObject('circle')}>
        <CircleIcon />
      </Button>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => createObject('box')}>
        <CubeIcon />
      </Button>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => createObject('sphere')}>
        <SphereIcon />
      </Button>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => createObject('path')}>
        <PathIcon />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-7 h-7" disabled={!design}>
            <DotsThreeIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => createObject('cylinder')}>
            <CylinderIcon />
            Cylinder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
