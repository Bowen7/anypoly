import { Provider } from 'jotai'
import Layout from './layout'
import { Canvas } from './canvas'
import { NameDialog } from '@/components/name-dialog'
import { SyncManager } from '@/components/sync-manager'
import { store } from '@/lib/atom'

export const App = () => {
  return (
    <Provider store={store}>
      <Layout>
        <Canvas />
      </Layout>
      <NameDialog />
      <SyncManager />
    </Provider>
  )
}
