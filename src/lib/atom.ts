import type { DesignModel } from './types'
import { atom } from 'jotai'

export const designAtom = atom<DesignModel | null>(null)
export const isNodeTreeHoverAtom = atom(false)
export const selectedAtom = atom<string | null>(null)
