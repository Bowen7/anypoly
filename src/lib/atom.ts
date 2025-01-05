import { atom, createStore } from 'jotai'
import type * as THREE from 'three'
import { atomWithImmer } from 'jotai-immer'
import { atomWithStorage } from 'jotai/utils'
import type { PolyObject } from './types'

export const designIdAtom = atom(-1)
export const sceneIdAtom = atom(-1)
export const isEmptyAtom = atom(get => get(designIdAtom) === -1)

export const isObjectTreeHoverAtom = atom(false)
export const minimizedAtom = atomWithStorage('minimized', false)

export const isRenamingAtom = atom(false)
export const isCreatingAtom = atom(false)

export const objectsAtom = atomWithImmer<PolyObject[]>([])
export const focusedObjectAtom = atom<PolyObject | null>(null)
export const focusedIdAtom = atom(get => get(focusedObjectAtom)?.id ?? '')

export const exportTargetAtom = atom<THREE.Scene | null>(null)
export const portalTargetAtom = atom<THREE.Object3D | null>(null)

export const isDraggingAtom = atom(false)

export const store = createStore()
