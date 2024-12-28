import * as THREE from 'three'

const getBoxFromObject = (object: THREE.Object3D, precise?: boolean): THREE.Box3 => {
  const box = new THREE.Box3()
  box.setFromObject(object, precise)
  return box
}
