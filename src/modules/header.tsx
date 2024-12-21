import { SidebarTrigger } from '@/components/ui/sidebar'

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 h-12 border-b">
      <h1 className="text-xl font-bold">Anypoly</h1>
      <SidebarTrigger />
    </header>
  )
}
