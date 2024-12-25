import { Label } from '@/components/ui/label'

type EditorPanelProps = {
  children: React.ReactNode
}
export const EditorPanel = ({ children }: EditorPanelProps) => {
  return (
    <div className="flex flex-col gap-2">
      {children}
    </div>
  )
}

type EditorPanelGroupProps = {
  children: React.ReactNode
  className?: string
}
export const EditorPanelGroup = ({ children }: EditorPanelGroupProps) => {
  return <div className="p-2 flex flex-col gap-4">{children}</div>
}

type EditorPanelItemProps = {
  children: React.ReactNode
  label: string
}
export const EditorPanelItem = ({ children, label }: EditorPanelItemProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex flex-row gap-2 items-center">{children}</div>
    </div>
  )
}
