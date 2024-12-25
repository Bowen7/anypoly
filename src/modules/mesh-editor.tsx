import { Eye as EyeIcon, EyeSlash as EyeSlashIcon, Trash as TrashIcon } from '@phosphor-icons/react'
import { parsePath, serialize } from 'path-data-parser'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Mesh3D, PathMesh3D } from '@/lib/types'
import { MultipleInputs } from '@/components/multiple-inputs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useRemoveMesh, useUpdateMesh } from '@/lib'
import { Checkbox } from '@/components/ui/checkbox'
import { EditorPanel, EditorPanelGroup, EditorPanelItem } from '@/components/editor-panel'

export type Props = {
  mesh: Mesh3D
}

const LABELS = {
  position: ['x', 'y', 'z'],
  rotation: ['x', 'y', 'z'],
  scale: ['x', 'y', 'z'],
  box: ['width', 'height', 'depth', 'widthSegs', 'heightSegs', 'depthSegs'],
  sphere: ['radius', 'widthSegs', 'heightSegs', 'phiStart', 'phiLen(*PI)', 'thetaStart', 'thetaLen(*PI)'],
  circle: ['radius', 'segs', 'thetaStart', 'thetaLen(*PI)'],
  // TODO: more args
  cylinder: ['radiusTop', 'radiusBottom', 'height', 'radialSegs', 'heightSegs', 'openEnded', 'thetaStart', 'thetaLen(*PI)'],
  cone: ['radius', 'height', 'radialSegs', 'heightSegs', 'openEnded', 'thetaStart', 'thetaLen(*PI)'],
  plane: ['width', 'height', 'widthSegs', 'heightSegs'],
  path: ['curveSegs', 'steps', 'depth', 'bevelEnabled', 'bThickness', 'bSize', 'bOffset', 'bSegments'],
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
    }
    return values.args.length
  }, [values])

  return (
    <EditorPanel>
      <EditorPanelGroup>
        <EditorPanelItem label="Mesh name">
          <Input
            placeholder="Input your mesh name"
            value={values.name}
            onChange={(e) => {
              onChange({ name: e.target.value })
            }}
            className="w-36 h-7"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange({ visible: !values.visible })}
            className="h-7 w-7"
          >
            {values.visible ? <EyeIcon /> : <EyeSlashIcon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeMesh()}
            className="h-7 w-7"
          >
            <TrashIcon />
          </Button>
        </EditorPanelItem>
      </EditorPanelGroup>
      <Separator />
      <EditorPanelGroup>
        <EditorPanelItem label="Position">
          <MultipleInputs
            values={values.position}
            labels={LABELS.position}
            onChange={values => onChange({ position: values as [number, number, number] })}
          />
        </EditorPanelItem>
        <EditorPanelItem label="Rotation (deg)">
          <MultipleInputs
            values={values.rotation}
            labels={LABELS.rotation}
            onChange={values => onChange({ rotation: values as [number, number, number] })}
          />
        </EditorPanelItem>
        <EditorPanelItem label="Scale">
          <MultipleInputs
            values={values.scale}
            labels={LABELS.scale}
            onChange={values => onChange({ scale: values as [number, number, number] })}
          />
        </EditorPanelItem>
        {values.type === 'path' && (
          <EditorPanelItem label="D">
            <div className="flex-1">
              <Textarea
                value={values.d}
                onChange={(e) => {
                  onChange({ d: e.target.value })
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
          </EditorPanelItem>
        )}
        {values.type !== 'group' && (
          <EditorPanelItem label="Args">
            <div className="flex flex-col gap-2">
              {values.type === 'path' && (
                <div className="flex flex-row gap-2 items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extrude"
                      checked={values.extrude}
                      onCheckedChange={checked => onChange({ extrude: checked as boolean })}
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
                values={values.args}
                labels={LABELS[values.type]}
                n={argsN}
                onChange={values => onChange({ args: values as PathMesh3D['args'] })}
              />
            </div>
          </EditorPanelItem>
        )}
      </EditorPanelGroup>
      {values.type !== 'group' && (
        <>
          <Separator />
          <EditorPanelGroup>
            <EditorPanelItem label="Material Color">
              <span className="w-2 h-2 rounded-full" style={{ background: values.color }}></span>
              <Input
                value={values.color}
                onChange={(e) => {
                  onChange({ color: e.target.value })
                }}
                className="w-36 h-7"
              />
            </EditorPanelItem>
          </EditorPanelGroup>
        </>
      )}
    </EditorPanel>
  )
}
