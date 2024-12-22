import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import Layout from './layout'
import { Canvas } from './canvas'
import { useDesigns } from '@/lib/db'
import { designAtom } from '@/lib/atom'

export const App = () => {
  const designs = useDesigns()
  const setDesign = useSetAtom(designAtom)

  useEffect(() => {
    if (designs.length > 0) {
      setDesign(designs[0])
    }
  }, [designs, setDesign])

  return (
    <Layout>
      <Canvas />
    </Layout>
  )
}
