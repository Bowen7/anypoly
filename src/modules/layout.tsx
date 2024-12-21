import { useWindowSize } from 'usehooks-ts'
import { Sidebar } from './sidebar'
import { Editor } from './editor'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

const MIN_SIDE_WIDTH = 250
const MIN_MAIN_WIDTH = 500

export default function Layout({ children }: { children: React.ReactNode }) {
  const { width = 0 } = useWindowSize()
  const minSideSize = MIN_SIDE_WIDTH / width * 100
  const minMainSize = MIN_MAIN_WIDTH / width * 100
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={minSideSize} defaultSize={minSideSize}>
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel minSize={minMainSize}><main>{children}</main></ResizablePanel>
      <ResizableHandle />
      <ResizablePanel minSize={minSideSize} defaultSize={minSideSize}>
        <Editor />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
