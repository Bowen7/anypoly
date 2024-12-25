import { produce } from 'immer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toggle } from '@/components/ui/toggle'

type Props = {
  n?: number
  values: (number | boolean)[]
  labels: string[]
  onChange: (values: (number | boolean)[]) => void
}
export const MultipleInputs = ({ values, labels, n = values.length, onChange }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: n }, (_, index) => {
        const value = values[index]
        const label = labels[index]
        return typeof value === 'number'
          ? (
              <div key={label}>
                <Label className="ml-0.5 text-sm scale-90 block origin-left text-muted-foreground">{label}</Label>
                <Input
                  type="number"
                  value={value}
                  onChange={e => onChange(produce(values, (draft) => {
                    draft[index] = Number(e.target.value)
                  }))}
                  className="h-7"
                  autoSelect
                />
              </div>
            )
          : (
              <div key={label} className="flex flex-col">
                <Label className="ml-0.5 text-sm scale-90 block origin-left text-muted-foreground">{label}</Label>
                <Toggle
                  className="text-xs w-full h-7 justify-start pl-3.5"
                  pressed={value}
                  onPressedChange={pressed => onChange(produce(values, (draft) => {
                    draft[index] = pressed as boolean
                  }))}
                >
                  {value ? 'True' : 'False'}
                </Toggle>
              </div>
            )
      })}
    </div>
  )
}
