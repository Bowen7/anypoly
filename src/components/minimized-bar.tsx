import { SidebarSimple as SidebarIcon } from '@phosphor-icons/react'
import { useSetAtom } from 'jotai'
import { Button } from './ui/button'
import { minimizedAtom, useDesign } from '@/lib'

export const MinimizedBar = () => {
  const design = useDesign()
  const setMinimized = useSetAtom(minimizedAtom)
  return (
    <div className="absolute left-4 top-4 shadow p-2 rounded-lg bg-white select-none flex items-center gap-2">
      <Button variant="ghost" onClick={() => setMinimized(false)}>
        <span>{design?.name}</span>
        <SidebarIcon />
      </Button>
    </div>
  )
}
