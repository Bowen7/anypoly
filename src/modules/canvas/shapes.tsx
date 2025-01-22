import * as THREE from 'three'

const smileyShape = new THREE.Shape()
  .moveTo(80, 40)
  .absarc(40, 40, 40, 0, Math.PI * 2, false)

const smileyEye1Path = new THREE.Path()
  .moveTo(35, 20)
  .absellipse(25, 20, 10, 10, 0, Math.PI * 2, true)

const smileyEye2Path = new THREE.Path()
  .moveTo(65, 20)
  .absarc(55, 20, 10, 0, Math.PI * 2, true)

const smileyMouthPath = new THREE.Path()
  .moveTo(20, 40)
  .quadraticCurveTo(40, 60, 60, 40)
  .bezierCurveTo(70, 45, 70, 50, 60, 60)
  .quadraticCurveTo(40, 80, 20, 60)
  .quadraticCurveTo(5, 50, 20, 40)

smileyShape.holes.push(smileyEye1Path)
smileyShape.holes.push(smileyEye2Path)
smileyShape.holes.push(smileyMouthPath)

const californiaPts = []

californiaPts.push(new THREE.Vector2(610, 320))
californiaPts.push(new THREE.Vector2(450, 300))
californiaPts.push(new THREE.Vector2(392, 392))
californiaPts.push(new THREE.Vector2(266, 438))
californiaPts.push(new THREE.Vector2(190, 570))
californiaPts.push(new THREE.Vector2(190, 600))
californiaPts.push(new THREE.Vector2(160, 620))
californiaPts.push(new THREE.Vector2(160, 650))
californiaPts.push(new THREE.Vector2(180, 640))
californiaPts.push(new THREE.Vector2(165, 680))
californiaPts.push(new THREE.Vector2(150, 670))
californiaPts.push(new THREE.Vector2(90, 737))
californiaPts.push(new THREE.Vector2(80, 795))
californiaPts.push(new THREE.Vector2(50, 835))
californiaPts.push(new THREE.Vector2(64, 870))
californiaPts.push(new THREE.Vector2(60, 945))
californiaPts.push(new THREE.Vector2(300, 945))
californiaPts.push(new THREE.Vector2(300, 743))
californiaPts.push(new THREE.Vector2(600, 473))
californiaPts.push(new THREE.Vector2(626, 425))
californiaPts.push(new THREE.Vector2(600, 370))
californiaPts.push(new THREE.Vector2(610, 320))

for (let i = 0; i < californiaPts.length; i++) californiaPts[i].multiplyScalar(0.25)

const californiaShape = new THREE.Shape(californiaPts)

const x = 0
const y = 0
const fishShape = new THREE.Shape()
  .moveTo(x, y)
  .quadraticCurveTo(x + 50, y - 80, x + 90, y - 10)
  .quadraticCurveTo(x + 100, y - 10, x + 115, y - 40)
  .quadraticCurveTo(x + 115, y, x + 115, y + 40)
  .quadraticCurveTo(x + 100, y + 10, x + 90, y + 10)
  .quadraticCurveTo(x + 50, y + 80, x, y)

const heartShape = new THREE.Shape()
  .moveTo(x + 25, y + 25)
  .bezierCurveTo(x + 25, y + 25, x + 20, y, x, y)
  .bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35)
  .bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95)
  .bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35)
  .bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y)
  .bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25)

export { smileyShape, californiaShape, fishShape, heartShape }
