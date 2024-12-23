import { Eye as EyeIcon, EyeSlash as EyeSlashIcon, Trash as TrashIcon } from '@phosphor-icons/react'
import { parsePath, serialize } from 'path-data-parser'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Mesh3D, PathMesh3D } from '@/lib/types'
import { NumberInputs } from '@/components/number-inputs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useRemoveMesh, useUpdateMesh } from '@/lib/db'
import { Checkbox } from '@/components/ui/checkbox'

export type Props = {
  mesh: Mesh3D
}

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  e.stopPropagation()
}

export const MeshEditor = ({ mesh }: Props) => {
  const [values, setValues] = useState(mesh)
  const [dScale, setDScale] = useState(1)
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

  const onScaleClick = () => {
    const segments = parsePath((values as PathMesh3D).d).map(({ key, data }) => {
      if (key === 'a' || key === 'A') {
        return {
          key,
          data: data.map((d, i) => i === 3 || i === 4 ? d : d * dScale),
        }
      }
      return {
        key,
        data: data.map(d => d * dScale),
      }
    })
    const d = serialize(segments)
    onChange({ d })
    setDScale(1)
  }

  const argsN = useMemo(() => {
    if (values.type === 'group') {
      return 0
    }
    if (values.type === 'path') {
      if (!values.extrude) {
        return 1
      }
      if (!values.bevelEnabled) {
        return 3
      }
    }
    return values.args.length
  }, [values])

  return (
    <div className="flex flex-col gap-4">
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
      <div className="flex flex-col gap-2" onKeyDown={onKeyDown}>
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
      <div className="flex flex-col gap-2" onKeyDown={onKeyDown}>
        <Label>Position</Label>
        <NumberInputs
          values={values.position}
          onChange={values => onChange({ position: values as [number, number, number] })}
        />
      </div>
      <div className="flex flex-col gap-2" onKeyDown={onKeyDown}>
        <Label>Rotation (deg)</Label>
        <NumberInputs
          values={values.rotation}
          onChange={values => onChange({ rotation: values as [number, number, number] })}
        />
      </div>
      <div className="flex flex-col gap-2" onKeyDown={onKeyDown}>
        <Label>Scale</Label>
        <NumberInputs
          values={values.scale}
          onChange={values => onChange({ scale: values as [number, number, number] })}
        />
      </div>
      {values.type === 'path' && (
        <div className="flex flex-col gap-2" onKeyDown={onKeyDown}>
          <Label>D</Label>
          <Textarea
            value={values.d}
            onChange={(e) => {
              onChange({ d: e.target.value })
            }}
          />
          <div className="mt-2 flex gap-2">
            <Input
              type="number"
              value={dScale}
              className="max-w-24"
              onChange={e => setDScale(Number(e.target.value))}
            />
            <Button onClick={onScaleClick}>Scale</Button>
          </div>
        </div>
      )}
      {values.type !== 'group' && (
        <>
          <div className="flex flex-col gap-2" onKeyDown={onKeyDown}>
            <Label className="flex flex-row gap-2 items-center justify-between">
              Args
            </Label>
            {values.type === 'path' && (
              <div className="flex flex-row gap-2 items-center mb-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="extrude"
                    checked={values.extrude}
                    onCheckedChange={checked => onChange({ extrude: checked as boolean })}
                  />
                  <label
                    htmlFor="extrude"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Extrude
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bevelEnabled"
                    checked={values.bevelEnabled}
                    onCheckedChange={checked => onChange({ bevelEnabled: checked as boolean })}
                  />
                  <label
                    htmlFor="bevelEnabled"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Bevel Enabled
                  </label>
                </div>
              </div>
            )}
            <NumberInputs
              values={values.args}
              n={argsN}
              onChange={values => onChange({ args: values as number[] })}
            />
          </div>
          <Separator className="mt-2" />
          <div className="flex flex-col gap-2" onKeyDown={onKeyDown}>
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
