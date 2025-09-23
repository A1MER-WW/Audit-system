"use client"

interface TabItem {
  id: string
  label: string
  active?: boolean
}

interface TabNavigationProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = ""
}: TabNavigationProps) {
  return (
    <div className={`flex gap-0 mb-4 border-b overflow-x-auto ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? 'text-white bg-[#3E52B9] hover:bg-[#2A3A8F] border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}