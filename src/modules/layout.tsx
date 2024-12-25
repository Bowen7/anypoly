import { useWindowSize } from 'usehooks-ts'
import { useAtomValue } from 'jotai'
import { Sidebar } from './sidebar'
import { Editor } from './editor'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { minimizedAtom, useDesigns } from '@/lib'
import { MinimizedBar } from '@/components/minimized-bar'
import { EmptyState } from '@/components/empty-state'
import { Spinner } from '@/components/ui/spinner'

const MIN_SIDE_WIDTH = 250
const MIN_MAIN_WIDTH = 500

export default function Layout({ children }: { children: React.ReactNode }) {
  const minimized = useAtomValue(minimizedAtom)
  const { width = 0 } = useWindowSize()
  const minSideSize = MIN_SIDE_WIDTH / width * 100
  const minMainSize = MIN_MAIN_WIDTH / width * 100
  const designs = useDesigns()
  return (
    <ResizablePanelGroup direction="horizontal">
      {!minimized && (
        <>
          <ResizablePanel minSize={minSideSize} defaultSize={minSideSize}>
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle />
        </>
      )}
      <ResizablePanel minSize={minMainSize}>
        <main className="h-full">
          {designs
            ? (designs.length > 0 ? children : <EmptyState />)
            : <div className="flex justify-center items-center h-full"><Spinner /></div>}
        </main>
      </ResizablePanel>
      {!minimized && (
        <>
          <ResizableHandle />
          <ResizablePanel minSize={minSideSize} defaultSize={minSideSize}>
            <Editor />
          </ResizablePanel>
        </>
      )}
      {minimized && <MinimizedBar />}
    </ResizablePanelGroup>
  )
}
