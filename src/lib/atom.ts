import { atom } from 'jotai'
import type * as THREE from 'three'
import type { DesignModel } from './types'

export const designAtom = atom<DesignModel | null>(null)
export const isNodeTreeHoverAtom = atom(false)
export const selectedAtom = atom<string | null>(null)

export const outlinesAtom = atom<{
  geometry: THREE.BufferGeometry
  position: [number, number, number]
  scale: [number, number, number]
  rotation: [number, number, number]
} | null>(null)
