import { useState } from "react"

export default function TabView({ tabs }) {
    console.log(tabs)
    const [activeTab, setActiveTab] = useState(0)
    return (
        <>
            <div className='TabView'>
                <div className='tabs'>
                    {tabs.map(((tab, index) => (
                        <label className={index === activeTab ? 'tab activeTab' : 'tab'}
                            key={index} onClick={() => setActiveTab(index)}>{tab.name}</label>
                    )))}
                </div>
            </div>
            <div>
                {tabs[activeTab].content}
            </div>
        </>

    )
}