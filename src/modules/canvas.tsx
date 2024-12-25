import type { AxesHelper, Scene } from 'three'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'
import { useSetAtom } from 'jotai'
import { FloatBar } from './float-bar'
import { sceneRefAtom, useMeshes } from '@/lib'
import { Mesh } from '@/components/mesh'
import { Outlines } from '@/components/outlines'

type Size = {
  width?: number
  height?: number
}

export const Canvas = () => {
  const meshes = useMeshes()
  const ref = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene>(null)
  const axesRef = useRef<AxesHelper>(null)
  const setSceneRef = useSetAtom(sceneRefAtom)

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
    setSceneRef(sceneRef)
  }, [setSceneRef])

  return (
    <div ref={ref} className="h-full relative" onMouseDown={e => e.preventDefault()}>
      <ThreeCanvas style={{ width, height }} camera={{ position: [0, 0, 10] }}>
        <color attach="background" args={['#f0f0f0']} />
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
          {meshes.map(mesh => (
            <Mesh key={mesh.id} mesh={mesh} />
          ))}
        </scene>
        <Outlines />
        <Environment preset="sunset" environmentIntensity={0.5} />
        <axesHelper ref={axesRef} args={[10]} />
        <OrbitControls />
      </ThreeCanvas>
      <FloatBar />
    </div>
  )
}
