import { atom } from 'jotai'
import type * as THREE from 'three'
import { atomWithImmer } from 'jotai-immer'
import type { Mesh3D } from './types'

export const designIdAtom = atom(-1)
export const sceneIdAtom = atom(-1)

export const isMeshTreeHoverAtom = atom(false)
export const minimizedAtom = atom(false)

export const outlinesAtom = atom<{
  geometry: THREE.BufferGeometry
  position: [number, number, number]
} | null>(null)

export const isRenamingAtom = atom(false)
export const isCreatingAtom = atom(false)

export const meshesAtom = atomWithImmer<Mesh3D[]>([])
export const focusedMeshAtom = atom<Mesh3D | null>(null)
export const focusedIdAtom = atom(get => get(focusedMeshAtom)?.id ?? '')
