import React from 'react';
import { IonTabBar, IonTabButton, IonLabel } from '@ionic/react';
import '../styles/tabs.css';

export type TabType = 'películas' | 'series' | 'tv';

interface TabsIonicProps {
  tabs: TabType;
  setTabs: (tab: TabType) => void;
}

const tabItems: { key: TabType; label: string }[] = [
  { key: 'películas', label: 'Películas' },
  { key: 'series', label: 'Series' },
  { key: 'tv', label: 'TV' },
];

const TabsIonic: React.FC<TabsIonicProps> = ({ tabs, setTabs }) => (
  <IonTabBar slot="bottom" className="tabs">
    {tabItems.map(({ key, label }) => (
      <IonTabButton
        key={key}
        tab={key}
        className={`tab${tabs === key ? ' active' : ''}`}
        onClick={() => setTabs(key)}
      >
        <IonLabel>{label}</IonLabel>
      </IonTabButton>
    ))}
  </IonTabBar>
);

export default TabsIonic;