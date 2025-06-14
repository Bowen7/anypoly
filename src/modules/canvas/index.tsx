import type { AxesHelper, Scene } from 'three'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'
import { useSetAtom } from 'jotai'
import { ToolBelt } from './tool-belt'
import { Object } from './object'
import { Playground } from './playground'
import { exportTargetAtom, focusedObjectAtom, useObjects } from '@/lib'
import { PortalTarget } from '@/components/portal'

type Size = {
  width?: number
  height?: number
}

export const Canvas = () => {
  const objects = useObjects()
  const ref = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene>(null)
  const axesRef = useRef<AxesHelper>(null)
  const setExportTarget = useSetAtom(exportTargetAtom)
  const setFocusedObject = useSetAtom(focusedObjectAtom)

  const [{ width, height }, setSize] = useState<Size>({
    width: 0,
    height: 0,
  })

  const onResize = useDebounceCallback(setSize, 200)

  useResizeObserver({
    ref,
    onResize,
  })

  useEffect(() => {
    setExportTarget(sceneRef.current)
  }, [setExportTarget])

  useEffect(() => {
    axesRef.current?.setColors('#facc15', '#4ade80', '#60a5fa')
  }, [])

  const onPointerMissed = useCallback(() => {
    setFocusedObject(null)
  }, [setFocusedObject])

  return (
    <div ref={ref} className="h-full relative" onMouseDown={e => e.preventDefault()}>
      <ThreeCanvas style={{ width, height }} camera={{ position: [0, 0, 10] }} onPointerMissed={onPointerMissed}>
        <color attach="background" args={['#fff']} />
        <directionalLight
          position={[
            10,
            10,
            0,
          ]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={500}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
          shadow-camera-left={-50}
          shadow-camera-right={50}
        />
        <scene ref={sceneRef}>
          {objects.map(object => (
            <Object key={object.id} object={object} />
          ))}
        </scene>
        {/* <Playground /> */}
        <PortalTarget />
        <Environment preset="sunset" environmentIntensity={0.5} />
        <axesHelper ref={axesRef} args={[10]} />
        <OrbitControls makeDefault />
      </ThreeCanvas>
      <ToolBelt />
    </div>
  )
}
