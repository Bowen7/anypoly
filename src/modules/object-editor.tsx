import { Eye as EyeIcon, EyeSlash as EyeSlashIcon, Trash as TrashIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
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
  const updateMesh = useUpdateMesh()
  const removeMesh = useRemoveMesh()

  // const onChange = (key: keyof Mesh3D, value: any) => {
  //   setValues(prev => ({ ...prev, [key]: value }))
  // }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => updateMesh({ visible: !mesh.visible })}
        >
          {mesh.visible ? <EyeIcon /> : <EyeSlashIcon />}
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
          value={mesh.name}
          onChange={(e) => {
            updateMesh({ name: e.target.value })
          }}
          className="w-48"
        />
      </div>
      <div onKeyDown={onKeyDown}>
        <Label>Position</Label>
        <NumberInputs
          value={mesh.position}
          onChange={value => updateMesh({ position: value as [number, number, number] })}
        />
      </div>
      <div onKeyDown={onKeyDown}>
        <Label>Rotation (deg)</Label>
        <NumberInputs
          value={mesh.rotation}
          onChange={value => updateMesh({ rotation: value as [number, number, number] })}
        />
      </div>
      <div onKeyDown={onKeyDown}>
        <Label>Scale</Label>
        <NumberInputs
          value={mesh.scale}
          onChange={value => updateMesh({ scale: value as [number, number, number] })}
        />
      </div>
      {mesh.type === 'path' && (
        <div onKeyDown={onKeyDown}>
          <Label>D</Label>
          <Textarea
            value={mesh.d}
            onChange={(e) => {
              updateMesh({ d: e.target.value })
            }}
          />
        </div>
      )}
      {mesh.type !== 'group' && (
        <>
          <div onKeyDown={onKeyDown}>
            <Label>Args</Label>
            <NumberInputs
              n={mesh.args.length}
              value={mesh.args}
              onChange={value => updateMesh({ args: value as number[] })}
            />
          </div>
          <Separator className="mt-2" />
          <div onKeyDown={onKeyDown}>
            <Label>Material Color</Label>
            <div className="flex flex-row gap-2 items-center">
              <span className="w-2 h-2 rounded-full" style={{ background: mesh.color }}></span>
              <Input
                value={mesh.color}
                onChange={(e) => {
                  updateMesh({ color: e.target.value })
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
