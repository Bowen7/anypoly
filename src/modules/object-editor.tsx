import { Eye as EyeIcon, EyeSlash as EyeSlashIcon, Trash as TrashIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { Mesh3D } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { useRemoveMesh, useUpdateMesh } from '@/lib/db'
import { Label } from '@/components/ui/label'
import { NumberInputs } from '@/components/number-inputs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export type Props = {
  mesh: Mesh3D
}

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  e.stopPropagation()
}

export const ObjectEditor = ({ mesh }: Props) => {
  const [values, setValues] = useState(mesh)
  const initialValues = useRef(mesh)
  const updateMesh = useUpdateMesh()
  const removeMesh = useRemoveMesh()
  const updateMeshRef = useRef(updateMesh)
  updateMeshRef.current = updateMesh

  useEffect(() => {
    if (initialValues.current !== values) {
      updateMeshRef.current(values)
    }
  }, [values])

  const onChange = (partial: Partial<Mesh3D>) => {
    setValues(prev => ({ ...prev, ...partial } as Mesh3D))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange({ visible: !values.visible })}
        >
          {values.visible ? <EyeIcon /> : <EyeSlashIcon />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeMesh()}
        >
          <TrashIcon />
        </Button>
      </div>
      <div onKeyDown={onKeyDown}>
        <Label>Mesh Name</Label>
        <Input
          placeholder="Input your mesh name"
          value={values.name}
          onChange={(e) => {
            onChange({ name: e.target.value })
          }}
          className="w-48"
        />
      </div>
      <div onKeyDown={onKeyDown}>
        <Label>Position</Label>
        <NumberInputs
          value={values.position}
          onChange={value => onChange({ position: value as [number, number, number] })}
        />
      </div>
      <div onKeyDown={onKeyDown}>
        <Label>Rotation (deg)</Label>
        <NumberInputs
          value={values.rotation}
          onChange={value => onChange({ rotation: value as [number, number, number] })}
        />
      </div>
      <div onKeyDown={onKeyDown}>
        <Label>Scale</Label>
        <NumberInputs
          value={values.scale}
          onChange={value => onChange({ scale: value as [number, number, number] })}
        />
      </div>
      {values.type === 'path' && (
        <div onKeyDown={onKeyDown}>
          <Label>D</Label>
          <Textarea
            value={values.d}
            onChange={(e) => {
              onChange({ d: e.target.value })
            }}
          />
        </div>
      )}
      {values.type !== 'group' && (
        <>
          <div onKeyDown={onKeyDown}>
            <Label>Args</Label>
            <NumberInputs
              n={values.args.length}
              value={values.args}
              onChange={value => onChange({ args: value as number[] })}
            />
          </div>
          <Separator className="mt-2" />
          <div onKeyDown={onKeyDown}>
            <Label>Material Color</Label>
            <div className="flex flex-row gap-2 items-center">
              <span className="w-2 h-2 rounded-full" style={{ background: values.color }}></span>
              <Input
                value={values.color}
                onChange={(e) => {
                  onChange({ color: e.target.value })
                }}
                className="w-36"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
