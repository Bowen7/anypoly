import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as THREE from 'three'
import type { N3 } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const v3ToN3 = (v: THREE.Vector3): N3 => {
  return [v.x, v.y, v.z] as N3
}

export const quatToN3 = (q: THREE.Quaternion): N3 => {
  const euler = new THREE.Euler().setFromQuaternion(q)
  return [euler.x, euler.y, euler.z] as N3
}

export const quatToDegN3 = (q: THREE.Quaternion): N3 => {
  const euler = new THREE.Euler().setFromQuaternion(q)
  const { x, y, z } = euler
  return [x * (180 / Math.PI), y * (180 / Math.PI), z * (180 / Math.PI)] as N3
}

export const degToRadianN3 = (deg: N3): N3 => {
  const [x, y, z] = deg
  return [x * Math.PI / 180, y * Math.PI / 180, z * Math.PI / 180] as N3
}
