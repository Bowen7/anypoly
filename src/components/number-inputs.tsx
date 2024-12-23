import { produce } from 'immer'
import { Input } from '@/components/ui/input'

type Props = {
  n?: number
  values: number[]
  onChange: (values: number[]) => void
}
export const NumberInputs = ({ values, n = values.length, onChange }: Props) => {
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {Array.from({ length: n }, (_, index) => (
        <Input
          type="number"
          key={index}
          value={values[index]}
          onChange={e => onChange(produce(values, (draft) => {
            draft[index] = Number(e.target.value)
          }))}
          className="w-28"
        />
      ))}
    </div>
  )
}
