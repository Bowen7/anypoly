import Layout from './layout'
import { Canvas } from './canvas'
import { NameDialog } from '@/components/name-dialog'
import { SyncManager } from '@/components/sync-manager'

export const App = () => {
  return (
    <>
      <Layout>
        <Canvas />
      </Layout>
      <NameDialog />
      <SyncManager />
    </>
  )
}
