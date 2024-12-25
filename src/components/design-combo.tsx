import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { useAtomValue } from 'jotai'
import { cn } from '@/lib/utils'
import { designIdAtom, useDesigns, useSwitchDesign } from '@/lib'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function DesignCombo() {
  const [open, setOpen] = useState(false)
  const designId = useAtomValue(designIdAtom)
  const designs = useDesigns() ?? []
  const switchDesign = useSwitchDesign()
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between h-8 font-normal"
        >
          {designId > -1
            ? designs.find(design => design.id === designId)?.name
            : 'Select design...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0">
        <Command>
          <CommandInput placeholder="Search design..." className="h-8" />
          <CommandList>
            <CommandEmpty>No design found.</CommandEmpty>
            <CommandGroup>
              {designs.map(({ id, name }) => (
                <CommandItem
                  key={id}
                  value={id.toString()}
                  onSelect={() => {
                    switchDesign(id)
                    setOpen(false)
                  }}
                  className="h-7"
                >
                  <Check
                    className={cn(
                      'mr-1 h-4 w-4',
                      designId === id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
