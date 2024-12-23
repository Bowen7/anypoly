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
import { useDesign, useUpdateMeshes } from '@/lib/db'
import type { Mesh3D } from '@/lib/types'
import { createMesh } from '@/lib/utils'

export const FloatBar = () => {
  const design = useDesign()
  const updateDesignMeshes = useUpdateMeshes()
  const onClick = (type: Mesh3D['type']) => {
    const mesh = createMesh(type)
    updateDesignMeshes([...(design?.meshes ?? []), mesh])
  }
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 shadow p-2 rounded-lg bg-white select-none">
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => onClick('group')}>
        <RectangleDashedIcon />
      </Button>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => onClick('box')}>
        <SquareIcon />
      </Button>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => onClick('circle')}>
        <CircleIcon />
      </Button>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => onClick('cylinder')}>
        <CubeIcon />
      </Button>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => onClick('sphere')}>
        <SphereIcon />
      </Button>
      <Button variant="ghost" className="w-7 h-7" disabled={!design} onClick={() => onClick('path')}>
        <PathIcon />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-7 h-7" disabled={!design}>
            <DotsThreeIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onClick('cylinder')}>
            <CylinderIcon />
            Cylinder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
