import { atom } from 'jotai'
import type * as THREE from 'three'
import type { DesignModel } from './types'

export const designAtom = atom<DesignModel | null>(null)
export const isMeshTreeHoverAtom = atom(false)
export const selectedAtom = atom<string | null>(null)

export const minimizedAtom = atom(false)

export const outlinesAtom = atom<{
  geometry: THREE.BufferGeometry
  position: [number, number, number]
} | null>(null)
