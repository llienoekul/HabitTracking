import { useState } from "react"

export default function TabView({ tabs }) {
    const [activeTab, setActiveTab] = useState('')
    return (
        <div>
            {Object.entries(tabs).map(([key, value]) => (
                <td key={key}>{key}</td>
            ))}
        </div>
    )
}