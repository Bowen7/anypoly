import { useEffect, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { ObjectProperties } from './object-properties'
import { GlobalProperties } from './global-properties'
import { Chat } from './chat'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { focusedIdAtom } from '@/lib'
import { Separator } from '@/components/ui/separator'

export const PropertiesPanel = () => {
  const focusedId = useAtomValue(focusedIdAtom)
  const [selectedTab, setSelectedTab] = useState('global')
  const prevFocusedId = useRef(focusedId)

  useEffect(() => {
    if (prevFocusedId.current !== focusedId) {
      if (focusedId === '') {
        setSelectedTab('global')
      } else {
        setSelectedTab('object')
      }
    }
    prevFocusedId.current = focusedId
  }, [focusedId])

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
      <TabsList className="grid grid-cols-3 m-3">
        <TabsTrigger value="object" disabled={!focusedId}>Object</TabsTrigger>
        <TabsTrigger value="global">Global</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>
      <Separator />
      <TabsContent value="object" className="flex-1">
        {focusedId && <ObjectProperties />}
      </TabsContent>
      <TabsContent value="global">
        <GlobalProperties />
      </TabsContent>
      <TabsContent value="chat">
        <Chat />
      </TabsContent>
    </Tabs>
  )
}
