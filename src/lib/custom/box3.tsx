import * as THREE from 'three'

const _vector = new THREE.Vector3()
const _box = new THREE.Box3()

// modified from three.js to support ignore some objects by userData.ignore
export const getBoxFromObject = (object: THREE.Object3D, precise?: boolean): THREE.Box3 => {
  const box = new THREE.Box3()
  box.makeEmpty()
  // Computes the world-axis-aligned bounding box of an object (including its children),
  // accounting for both the object's, and children's, world transforms
  const expandByObject = (object: THREE.Object3D, precise?: boolean) => {
    if (object.userData.ignore) {
      return
    }
    object.updateWorldMatrix(false, false)
    // @ts-ignore
    const geometry = object.geometry

    if (geometry !== undefined) {
      const positionAttribute = geometry.getAttribute('position')

      // precise AABB computation based on vertex data requires at least a position attribute.
      // instancing isn't supported so far and uses the normal (conservative) code path.

      // @ts-ignore
      if (precise === true && positionAttribute !== undefined && object.isInstancedMesh !== true) {
        for (let i = 0, l = positionAttribute.count; i < l; i++) {
          // @ts-ignore
          if (object.isMesh === true) {
            // @ts-ignore
            object.getVertexPosition(i, _vector)
          } else {
            _vector.fromBufferAttribute(positionAttribute, i)
          }

          _vector.applyMatrix4(object.matrixWorld)
          box.expandByPoint(_vector)
        }
      } else {
        // @ts-ignore
        if (object.boundingBox !== undefined) {
          // object-level bounding box
          // @ts-ignore
          if (object.boundingBox === null) {
            // @ts-ignore
            object.computeBoundingBox()
          }
          // @ts-ignore
          _box.copy(object.boundingBox)
        } else {
          // geometry-level bounding box
          // @ts-ignore
          if (geometry.boundingBox === null) {
            // @ts-ignore
            geometry.computeBoundingBox()
          }
          // @ts-ignore
          _box.copy(geometry.boundingBox)
        }

        _box.applyMatrix4(object.matrixWorld)

        box.union(_box)
      }
    }

    const children = object.children

    for (let i = 0, l = children.length; i < l; i++) {
      expandByObject(children[i], precise)
    }
  }

  expandByObject(object, precise)
  return box
}
