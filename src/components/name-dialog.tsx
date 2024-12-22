import { useDeferredValue, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateDesign, useDesign, useUpdateDesignName } from '@/lib/db'

type Props = {
  type: 'new' | 'rename'
  open: boolean
  onOpenChange: (open: boolean) => void
}
export const NameDialog = ({ type, open, onOpenChange }: Props) => {
  const deferredOpen = useDeferredValue(open)
  const [name, setName] = useState('')
  const design = useDesign()

  const createDesign = useCreateDesign()
  const updateDesignName = useUpdateDesignName()

  useEffect(() => {
    if (open && !deferredOpen) {
      setName(type === 'rename' ? design?.name || '' : '')
    }
  }, [open, deferredOpen, design, type])

  const onSubmit = () => {
    if (type === 'new') {
      createDesign(name)
    } else {
      updateDesignName(name)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === 'new' ? 'New File' : 'Rename'}</DialogTitle>
          <DialogDescription>
            Enter the name of the
            {' '}
            {type === 'new' ? 'new file' : 'file'}
          </DialogDescription>
        </DialogHeader>
        <div className="pb-4">
          <Input value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            {type === 'new' ? 'Create' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
