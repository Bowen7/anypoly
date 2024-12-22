import { useMemo, useRef, useState } from 'react'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'
import { Separator } from '@/components/ui/separator'
import { NodeTree } from '@/components/node-tree'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { NameDialog } from '@/components/name-dialog'
import { useDesign } from '@/lib/db'

type Size = {
  width?: number
  height?: number
}

export const Sidebar = () => {
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [{ height }, setSize] = useState<Size>({
    width: 0,
    height: 0,
  })
  const design = useDesign()
  const treeData = useMemo(() => {
    return design?.meshes || []
  }, [design])

  const onResize = useDebounceCallback(setSize, 200)

  useResizeObserver({
    ref,
    onResize,
  })

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 flex flex-col gap-2">
        <Menubar>
          <span className="font-bold pl-2">Anypoly</span>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setIsNewDialogOpen(true)}>
                New File
              </MenubarItem>
              <MenubarItem onClick={() => setIsRenameDialogOpen(true)}>
                Rename
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <Separator />
      <div ref={ref} className="flex-1 p-2">
        <NodeTree data={treeData} height={height!} />
      </div>
      <NameDialog
        type="new"
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
      />
      <NameDialog
        type="rename"
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      />
    </div>
  )
}
