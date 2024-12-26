import { createPortal } from '@react-three/fiber'
import { memo, useLayoutEffect, useRef } from 'react'
import type * as THREE from 'three'
import { useAtomValue, useSetAtom } from 'jotai'
import { portalTargetAtom } from '@/lib/atom'

export const PortalTarget = memo(() => {
  const ref = useRef<THREE.Object3D>(null)
  const setTarget = useSetAtom(portalTargetAtom)
  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }
    setTarget(ref.current)
    return () => {
      setTarget(null)
    }
  }, [setTarget])
  return (
    <object3D ref={ref} />
  )
})

type Props = {
  children: React.ReactNode
}
export const Portal = ({ children }: Props) => {
  const target = useAtomValue(portalTargetAtom)
  return (
    target && createPortal(children, target)
  )
}
