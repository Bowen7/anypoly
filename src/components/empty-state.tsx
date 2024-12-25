import { useSetAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { isCreatingAtom } from '@/lib'

export const EmptyState = () => {
  const setIsCreating = useSetAtom(isCreatingAtom)
  return (
    <div className="flex items-center  h-full flex-col gap-4 justify-center">
      <span className="text-sm text-secondary-foreground">There is no design. Please create one first.</span>
      <Button onClick={() => setIsCreating(true)}>Create</Button>
    </div>
  )
}
