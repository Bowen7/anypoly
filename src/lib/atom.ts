import { atom } from 'jotai'
import type { DesignModel } from './types'

export const designAtom = atom<DesignModel | null>(null)
export const isNodeTreeHoverAtom = atom(false)
export const selectedAtom = atom<string | null>(null)
