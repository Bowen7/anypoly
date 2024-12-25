import { atom } from 'jotai'
import type * as THREE from 'three'
import { atomWithImmer } from 'jotai-immer'
import type React from 'react'
import type { Mesh3D } from './types'

export const designIdAtom = atom(-1)
export const sceneIdAtom = atom(-1)

export const isEmptyAtom = atom(get => get(designIdAtom) === -1)

export const isMeshTreeHoverAtom = atom(false)
export const minimizedAtom = atom(false)

export const isRenamingAtom = atom(false)
export const isCreatingAtom = atom(false)

export const meshesAtom = atomWithImmer<Mesh3D[]>([])
export const focusedMeshAtom = atom<Mesh3D | null>(null)
export const focusedIdAtom = atom(get => get(focusedMeshAtom)?.id ?? '')

export const outlinesTargetAtom = atom<THREE.Object3D | null>(null)

export const sceneRefAtom = atom<React.MutableRefObject<THREE.Scene | null> | null>(null)
