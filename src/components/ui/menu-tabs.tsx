import { memo } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ITabsProps {
  view: "dashboard" | "list"
  onChangeView: (view: "dashboard" | "list") => void
}

const MenuTabs = ({ onChangeView, view }: ITabsProps) => {
  return (
    <Tabs
      value={view}
      onValueChange={(type) => onChangeView(type as "dashboard" | "list")}
    >
      <TabsList variant="line">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="list">List</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default memo(MenuTabs)
