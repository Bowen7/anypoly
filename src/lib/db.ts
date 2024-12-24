import { Dexie } from 'dexie'
import type { EntityTable } from 'dexie'
import type { DesignModel, SceneModel } from './types'

const db = new Dexie('AnypolyDB') as Dexie & {
  designs: EntityTable<DesignModel, 'id'>
  scenes: EntityTable<SceneModel, 'id'>
}

db.version(1).stores({
  designs: '++id, lastSelected',
  scenes: '++id, design, updated',
})

export {
  db,
}
