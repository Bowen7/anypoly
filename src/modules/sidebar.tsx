import { useRef, useState } from 'react'
import { Gear as GearIcon } from '@phosphor-icons/react'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { NodeTree } from '@/components/node-tree'

type Size = {
  width?: number
  height?: number
}

const data = [
  { id: '1', name: 'Unread' },
  { id: '2', name: 'Threads' },
  {
    id: '3',
    name: 'Chat Rooms',
    children: [
      { id: 'c1', name: 'General' },
      { id: 'c2', name: 'Random' },
      { id: 'c3', name: 'Open Source Projects' },
    ],
  },
  {
    id: '4',
    name: 'Direct Messages',
    children: [
      { id: 'd1', name: 'Alice' },
      { id: 'd2', name: 'Bob' },
      { id: 'd3', name: 'Charlie' },
    ],
  },
]
export const Sidebar = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ height }, setSize] = useState<Size>({
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
      <div className="flex items-center justify-between p-2">
        <h1 className="text-2xl font-bold">Anypoly</h1>
        <Button variant="ghost" size="icon" className="w-7 h-7">
          <GearIcon />
        </Button>
      </div>
      <Separator />
      <div ref={ref} className="flex-1 overflow-hidden flex p-2">
        <NodeTree data={data} height={height!} />
      </div>
    </div>
  )
}
