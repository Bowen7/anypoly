import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

export const Editor = () => {
  return (
    <Tabs defaultValue="account" className="p-2 h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="flex-1">
        123
      </TabsContent>
      <TabsContent value="password">
        456
      </TabsContent>
    </Tabs>
  )
}
