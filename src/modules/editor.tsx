import { MeshEditor } from './mesh-editor'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useFocusedMesh } from '@/lib'
import { Separator } from '@/components/ui/separator'

export const Editor = () => {
  const mesh = useFocusedMesh()
  return (
    <Tabs defaultValue="mesh" className="h-full flex flex-col">
      <TabsList className="grid grid-cols-2 m-3">
        <TabsTrigger value="mesh">Mesh</TabsTrigger>
        <TabsTrigger value="global">Global</TabsTrigger>
      </TabsList>
      <Separator />
      <TabsContent value="mesh" className="flex-1">
        {mesh && <MeshEditor mesh={mesh} key={mesh.id} />}
      </TabsContent>
      <TabsContent value="global">
        456
      </TabsContent>
    </Tabs>
  )
}
