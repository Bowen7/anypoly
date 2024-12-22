import { produce } from 'immer'
import { Input } from '@/components/ui/input'

type Props = {
  n?: number
  value: number[]
  onChange: (value: number[]) => void
}
export const NumberInputs = ({ n = 3, value, onChange }: Props) => {
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {Array.from({ length: n }).map((_, index) => (
        <Input
          type="number"
          key={index}
          value={value[index]}
          onChange={e => onChange(produce(value, (draft) => {
            draft[index] = Number(e.target.value)
          }))}
          className="w-28"
        />
      ))}
    </div>
  )
}
