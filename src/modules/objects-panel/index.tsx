import { useRef, useState } from 'react'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'
import { SidebarSimple as SidebarIcon } from '@phosphor-icons/react'
import { useSetAtom } from 'jotai'
import { ObjectTree } from './object-tree'
import { Separator } from '@/components/ui/separator'
import { minimizedAtom, useObjects } from '@/lib'
import { LogoMenu } from '@/components/logo-menu'
import { DesignCombo } from '@/components/design-combo'
import { Button } from '@/components/ui/button'

type Size = {
  width?: number
  height?: number
}

export const ObjectsPanel = () => {
  const objects = useObjects()
  const ref = useRef<HTMLDivElement>(null)
  const [{ height, width }, setSize] = useState<Size>({
    width: 0,
    height: 0,
  })
  const setMinimized = useSetAtom(minimizedAtom)

  const onResize = useDebounceCallback(setSize, 100)

  useResizeObserver({
    ref,
    onResize,
  })

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <LogoMenu />
          <Button
            variant="ghost"
            size="icon"
            className="h-8"
            onClick={() => setMinimized(true)}
          >
            <SidebarIcon />
          </Button>
        </div>
        <DesignCombo />
      </div>
      <Separator />
      <div ref={ref} className="flex-1 p-2">
        <ObjectTree
          data={objects}
          height={height ?? 0}
          width={width ?? 0}
        />
      </div>
    </div>
  )
}
