import { ObjectProperties } from './object-properties'
import { GlobalProperties } from './global-properties'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useFocusedObject } from '@/lib'
import { Separator } from '@/components/ui/separator'

export const PropertiesPanel = () => {
  const object = useFocusedObject()
  return (
    <Tabs defaultValue="object" className="h-full flex flex-col">
      <TabsList className="grid grid-cols-2 m-3">
        <TabsTrigger value="object">Object</TabsTrigger>
        <TabsTrigger value="global">Global</TabsTrigger>
      </TabsList>
      <Separator />
      <TabsContent value="object" className="flex-1">
        {object && <ObjectProperties object={object} />}
      </TabsContent>
      <TabsContent value="global">
        <GlobalProperties />
      </TabsContent>
    </Tabs>
  )
}