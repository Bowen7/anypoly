import { CaretDown as CaretDownIcon } from '@phosphor-icons/react'
import { useSetAtom } from 'jotai'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { isCreatingAtom, isRenamingAtom } from '@/lib/atom'

export const LogoMenu = () => {
  const setIsRenaming = useSetAtom(isRenamingAtom)
  const setIsCreating = useSetAtom(isCreatingAtom)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button
            variant="ghost"
            className="font-mono text-sm font-bold [&_svg]:size-3 gap-1 w-auto"
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
          <DropdownMenuItem onClick={() => setIsRenaming(true)}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRenaming(true)}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Save as</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-8">
                <DropdownMenuItem>Glb</DropdownMenuItem>
                <DropdownMenuItem>JSON(TODO)</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Recent files</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-8">
                <DropdownMenuItem>Glb</DropdownMenuItem>
                <DropdownMenuItem>JSON(TODO)</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
