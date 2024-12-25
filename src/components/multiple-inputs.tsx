import { produce } from 'immer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

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
                <div className="flex flex-1 items-center">
                  <Checkbox
                    checked={value}
                    onCheckedChange={checked => onChange(produce(values, (draft) => {
                      draft[index] = checked as boolean
                    }))}
                    className="ml-1.5"
                  />
                </div>
              </div>
            )
      })}
    </div>
  )
}
