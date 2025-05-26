import React from 'react'
import '../styles/tabs.css';

interface TabsProps {
  tabs: string;
  setTabs: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, setTabs }) => {
  return (
    <>
        <div className={`tabs`}>
            <button className={`tab ${tabs === 'películas' ? 'active' : ''}`} onClick={() => setTabs('películas')}>Películas</button>
            <button className={`tab ${tabs === 'series' ? 'active' : ''}`} onClick={() => setTabs('series')}>Series</button>
            <button className={`tab ${tabs === 'tv' ? 'active' : ''}`} onClick={() => setTabs('tv')}>TV</button>
        </div>
        
    </>
  )
}

export default Tabs