import { MeshEditor } from './mesh-editor'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useMesh } from '@/lib/db'

export const Editor = () => {
  const mesh = useMesh()
  return (
    <Tabs defaultValue="object" className="p-2 h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="object">Object</TabsTrigger>
        <TabsTrigger value="global">Global</TabsTrigger>
      </TabsList>
      <TabsContent value="object" className="flex-1">
        {mesh && <MeshEditor mesh={mesh} key={mesh.id} />}
      </TabsContent>
      <TabsContent value="global">
        456
      </TabsContent>
    </Tabs>
  )
}
