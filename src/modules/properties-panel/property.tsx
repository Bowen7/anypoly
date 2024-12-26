import { Label } from '@/components/ui/label'

type PropertiesPanelProps = {
  children: React.ReactNode
}
export const PropertiesPanel = ({ children }: PropertiesPanelProps) => {
  return (
    <div className="flex flex-col gap-2">
      {children}
    </div>
  )
}

type PropertiesGroupProps = {
  children: React.ReactNode
  className?: string
}
export const PropertiesGroup = ({ children }: PropertiesGroupProps) => {
  return <div className="px-3 py-2 flex flex-col gap-4">{children}</div>
}

type PropertyItemProps = {
  children: React.ReactNode
  label: string
}
export const PropertyItem = ({ children, label }: PropertyItemProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex flex-row gap-2 items-center">{children}</div>
    </div>
  )
}
