import { useEffect, useState } from 'react'
import Habits from './components/Habits.jsx'
import HabitAnalytics from './components/HabitAnalytics.jsx'
import TabView from './components/TabView.jsx'
import './App.css'

const date = new Date()
let m = date.getMonth() + 1
const y = date.getFullYear()
let d = date.getDate()
if (d < 10) { d = `0${d}` }
if (m < 10) { m = `0${m}` }
const today = `${y}-${m}-${d}`;

function App() {

  const tab1 = <Habits />
  const tab2 = <HabitAnalytics />
  const tabs = [{ name: 'habitProgress', content: tab1 }, { name: 'Analytics', content: tab2 }]
  return (
    <>
      
      <TabView tabs={tabs} />

    </>
  )
}

export default App