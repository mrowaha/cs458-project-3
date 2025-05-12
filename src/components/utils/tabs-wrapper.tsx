export interface TabBase {
  id: number;
  text: React.ReactNode;
}

export interface TabsWrapperProps<T extends TabBase> {
  tabs: Array<T>;
  selectedTab: number;
  onSelectTab: (tabId: number) => void;
  onCloseTab?: (tabId: number) => void;
}

export const TabsWrapper = <T extends TabBase>({
  tabs,
  selectedTab,
  onSelectTab,
}: TabsWrapperProps<T>) => {
  return (
    <div className="tab-nav-container">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className="tab-button"
          data-active={tab.id === selectedTab}
        >
          {tab.text}
        </div>
      ))}
    </div>
  );
};
