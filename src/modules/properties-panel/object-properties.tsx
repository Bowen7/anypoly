import { Eye as EyeIcon, EyeSlash as EyeSlashIcon, Trash as TrashIcon } from '@phosphor-icons/react'
import { parsePath, serialize } from 'path-data-parser'
import { useMemo, useState } from 'react'
import { PropertiesGroup, PropertiesPanel, PropertyItem } from './property'
import type { PolyObject, PolyPathMesh } from '@/lib/types'
import { MultipleInputs } from '@/components/multiple-inputs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useRemoveObject, useUpdateObject } from '@/lib'
import { Checkbox } from '@/components/ui/checkbox'

export type Props = {
  object: PolyObject
}

const LABELS = {
  position: ['x', 'y', 'z'],
  rotation: ['x', 'y', 'z'],
  scale: ['x', 'y', 'z'],
  box: ['width', 'height', 'depth', 'widthSegs', 'heightSegs', 'depthSegs'],
  sphere: ['radius', 'widthSegs', 'heightSegs', 'phiStart', 'phiLen(*PI)', 'thetaStart', 'thetaLen(*PI)'],
  circle: ['radius', 'segs', 'thetaStart', 'thetaLen(*PI)'],
  cylinder: ['radiusTop', 'radiusBottom', 'height', 'radialSegs', 'heightSegs', 'openEnded', 'thetaStart', 'thetaLen(*PI)'],
  cone: ['radius', 'height', 'radialSegs', 'heightSegs', 'openEnded', 'thetaStart', 'thetaLen(*PI)'],
  plane: ['width', 'height', 'widthSegs', 'heightSegs'],
  path: ['curveSegs', 'steps', 'depth', 'bevelEnabled', 'bThickness', 'bSize', 'bOffset', 'bSegments'],
}

export const ObjectProperties = ({ object }: Props) => {
  const [dScale, setDScale] = useState(1)
  const updateObject = useUpdateObject()
  const removeObject = useRemoveObject()

  const onScaleClick = () => {
    const segments = parsePath((object as PolyPathMesh).d).map(({ key, data }) => {
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
    updateObject({ d })
    setDScale(1)
  }

  const argsN = useMemo(() => {
    if (object.type === 'group') {
      return 0
    }
    if (object.type === 'path') {
      if (!object.extrude) {
        return 1
      }
    }
    return object.args.length
  }, [object])

  return (
    <PropertiesPanel>
      <PropertiesGroup>
        <PropertyItem label="Object name">
          <Input
            placeholder="Input object name"
            value={object.name}
            onChange={(e) => {
              updateObject({ name: e.target.value })
            }}
            className="w-36 h-7"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateObject({ visible: !object.visible })}
            className="h-7 w-7"
          >
            {object.visible ? <EyeIcon /> : <EyeSlashIcon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeObject()}
            className="h-7 w-7"
          >
            <TrashIcon />
          </Button>
        </PropertyItem>
      </PropertiesGroup>
      <Separator />
      <PropertiesGroup>
        <PropertyItem label="Position">
          <MultipleInputs
            values={object.position}
            labels={LABELS.position}
            onChange={values => updateObject({ position: values as [number, number, number] })}
          />
        </PropertyItem>
        <PropertyItem label="Rotation (deg)">
          <MultipleInputs
            values={object.rotation}
            labels={LABELS.rotation}
            onChange={values => updateObject({ rotation: values as [number, number, number] })}
          />
        </PropertyItem>
        <PropertyItem label="Scale">
          <MultipleInputs
            values={object.scale}
            labels={LABELS.scale}
            onChange={values => updateObject({ scale: values as [number, number, number] })}
          />
        </PropertyItem>
        {object.type === 'path' && (
          <PropertyItem label="D">
            <div className="flex-1">
              <Textarea
                value={object.d}
                onChange={(e) => {
                  updateObject({ d: e.target.value })
                }}
              />
              <div className="mt-2 flex gap-2 items-center">
                <Input
                  type="number"
                  value={dScale}
                  className="max-w-24 h-7"
                  onChange={e => setDScale(Number(e.target.value))}
                />
                <Button onClick={onScaleClick} className="h-7" variant="outline">Scale d</Button>
              </div>
            </div>
          </PropertyItem>
        )}
        {object.type !== 'group' && (
          <PropertyItem label="Args">
            <div className="flex flex-col gap-2">
              {object.type === 'path' && (
                <div className="flex flex-row gap-2 items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extrude"
                      checked={object.extrude}
                      onCheckedChange={checked => updateObject({ extrude: checked as boolean })}
                    />
                    <label
                      htmlFor="extrude"
                      className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs"
                    >
                      Extrude
                    </label>
                  </div>
                </div>
              )}
              <MultipleInputs
                values={object.args}
                labels={LABELS[object.type]}
                n={argsN}
                onChange={values => updateObject({ args: values as PolyPathMesh['args'] })}
              />
            </div>
          </PropertyItem>
        )}
      </PropertiesGroup>
      {object.type !== 'group' && (
        <>
          <Separator />
          <PropertiesGroup>
            <PropertyItem label="Material Color">
              <span className="w-2 h-2 rounded-full" style={{ background: object.color }}></span>
              <Input
                value={object.color}
                onChange={(e) => {
                  updateObject({ color: e.target.value })
                }}
                className="w-36 h-7"
              />
            </PropertyItem>
          </PropertiesGroup>
        </>
      )}
    </PropertiesPanel>
  )
}
