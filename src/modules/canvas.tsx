import type { Scene } from 'three'
import { DownloadSimple as DownloadSimpleIcon } from '@phosphor-icons/react'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { saveAs } from 'file-saver'
import { useRef, useState } from 'react'
import { GLTFExporter } from 'three/addons'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'
import { FloatBar } from './float-bar'
import { useMeshes } from '@/lib'
import { Button } from '@/components/ui/button'
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
  const [{ width, height }, setSize] = useState<Size>({
    width: 0,
    height: 0,
  })

  const onResize = useDebounceCallback(setSize, 200)

  const download = () => {
    const exporter = new GLTFExporter()
    exporter.parse(sceneRef.current!, (gltfJson) => {
      saveAs(new Blob([gltfJson as ArrayBuffer], { type: 'application/octet-stream' }), 'test.glb')
    }, (error) => {
      console.error(error)
    }, { binary: true })
  }

  useResizeObserver({
    ref,
    onResize,
  })

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
        <axesHelper args={[10]} />
        <OrbitControls />
      </ThreeCanvas>
      <div className="absolute top-4 right-4 shadow-lg px-2 py-1 bg-white rounded-md select-none flex items-center gap-2" onMouseDown={e => e.preventDefault()}>
        <Button variant="ghost" size="icon" onClick={download} className="w-7 h-7">
          <DownloadSimpleIcon />
        </Button>
      </div>
      <FloatBar />
    </div>
  )
}
