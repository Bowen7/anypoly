import { produce } from 'immer'
import { Input } from '@/components/ui/input'

type Props = {
  values: number[]
  onChange: (values: number[]) => void
}
export const NumberInputs = ({ values, onChange }: Props) => {
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {values.map((value, index) => (
        <Input
          type="number"
          key={index}
          value={value}
          onChange={e => onChange(produce(values, (draft) => {
            draft[index] = Number(e.target.value)
          }))}
          className="w-28"
        />
      ))}
    </div>
  )
}
