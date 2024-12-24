import { useRef, useState } from 'react'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'
import { Separator } from '@/components/ui/separator'
import { MeshTree } from '@/components/mesh-tree'
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { useMeshes } from '@/lib'
import { LogoMenu } from '@/components/logo-menu'

type Size = {
  width?: number
  height?: number
}

export const Sidebar = () => {
  const meshes = useMeshes()
  const ref = useRef<HTMLDivElement>(null)
  const [{ height, width }, setSize] = useState<Size>({
    width: 0,
    height: 0,
  })

  const onResize = useDebounceCallback(setSize, 200)

  useResizeObserver({
    ref,
    onResize,
  })

  return (
    <div className="h-full flex flex-col">
      <LogoMenu />
      <div className="p-2 flex flex-col gap-2">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              {/* <MenubarItem onClick={() => setIsNewDialogOpen(true)}>
                New File
              </MenubarItem>
              <MenubarItem onClick={() => setIsRenameDialogOpen(true)}>
                Rename
              </MenubarItem> */}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <Separator />
      <div ref={ref} className="flex-1 p-2">
        <MeshTree
          data={meshes}
          height={height ?? 0}
          width={width ?? 0}
        />
      </div>
    </div>
  )
}
