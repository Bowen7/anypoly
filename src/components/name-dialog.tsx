import { useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
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
import { isCreatingAtom, isRenamingAtom, useCreateDesign, useDesign, useUpdateDesignName } from '@/lib'

export const NameDialog = () => {
  const design = useDesign()
  const [isRenaming, setIsRenaming] = useAtom(isRenamingAtom)
  const [isCreating, setIsCreating] = useAtom(isCreatingAtom)
  const [type, setType] = useState<'rename' | 'create'>('create')

  const isRenamingRef = useRef(isRenaming)

  const [name, setName] = useState('')

  const createDesign = useCreateDesign()
  const updateDesignName = useUpdateDesignName()

  useEffect(() => {
    if (isRenaming) {
      setType('rename')
    } else if (isCreating) {
      setType('create')
    }
    if (!isRenaming && !isCreating) {
      setName('')
    }
  }, [isRenaming, isCreating])

  useEffect(() => {
    if (isRenaming && isRenaming !== isRenamingRef.current) {
      isRenamingRef.current = isRenaming
      setName(design?.name || '')
    }
  }, [design, isRenamingRef, isRenaming])

  const onSubmit = async () => {
    if (isCreating) {
      await createDesign(name)
    } else {
      await updateDesignName(name)
    }
    setIsRenaming(false)
    setIsCreating(false)
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setIsRenaming(false)
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isRenaming || isCreating} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === 'create' ? 'New File' : 'Rename'}</DialogTitle>
          <DialogDescription>
            Enter the name of the
            {' '}
            {type === 'create' ? 'new file' : 'file'}
          </DialogDescription>
        </DialogHeader>
        <div className="pb-4">
          <Input value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            {type === 'create' ? 'Create' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
