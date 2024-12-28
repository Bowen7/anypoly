import { CaretDown as CaretDownIcon } from '@phosphor-icons/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { GLTFExporter } from 'three/addons'
import { saveAs } from 'file-saver'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { db, exportTargetAtom, isCreatingAtom, isEmptyAtom, isRenamingAtom, useDesign, useDesigns, useRemoveDesign, useSwitchDesign } from '@/lib'
import { ClearDesignsDialog, DeleteDesignDialog } from '@/components/dialogs'

const clearDesigns = async () => {
  await db.delete()
  window.location.reload()
}

export const LogoMenu = () => {
  const setIsRenaming = useSetAtom(isRenamingAtom)
  const setIsCreating = useSetAtom(isCreatingAtom)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const removeDesign = useRemoveDesign()
  const designs = useDesigns()
  const switchDesign = useSwitchDesign()
  const isEmpty = useAtomValue(isEmptyAtom)
  const design = useDesign()
  const exportTarget = useAtomValue(exportTargetAtom)

  const saveAsGlb = () => {
    if (!exportTarget) {
      return
    }
    const exporter = new GLTFExporter()
    exporter.parse(exportTarget, (gltfJson) => {
      saveAs(new Blob([gltfJson as ArrayBuffer], { type: 'application/octet-stream' }), `${design?.name ?? 'Untitled'}.glb`)
    }, (error) => {
      console.error(error)
    }, { binary: true })
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Button
              variant="ghost"
              className="font-mono text-sm font-bold [&_svg]:size-3 gap-1 w-auto h-8"
            >
              Anypoly
              <CaretDownIcon />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36" side="bottom" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsCreating(true)}>
              New file
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isEmpty} onClick={() => setIsRenaming(true)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Save as</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-8">
                  <DropdownMenuItem disabled={isEmpty} onClick={saveAsGlb}>Glb</DropdownMenuItem>
                  <DropdownMenuItem disabled={isEmpty}>JSON(TODO)</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem
              disabled={isEmpty}
              onClick={() => setIsDeleting(true)}
              className="text-destructive hover:text-destructive/90 focus:text-destructive/90"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={isEmpty}>Recent files</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-8">
                  {designs?.map(({ id, name }) => (
                    <DropdownMenuItem
                      key={id}
                      onClick={() => switchDesign(id)}
                    >
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-36">
                  <DropdownMenuItem
                    disabled={isEmpty}
                    onClick={() => setIsClearing(true)}
                    className="text-destructive hover:text-destructive/90 focus:text-destructive/90"
                  >
                    Clear all designs
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDesignDialog
        isOpen={isDeleting}
        onOpenChange={setIsDeleting}
        onConfirm={removeDesign}
      />
      <ClearDesignsDialog
        isOpen={isClearing}
        onOpenChange={setIsClearing}
        onConfirm={clearDesigns}
      />
    </>
  )
}
