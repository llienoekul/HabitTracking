import { RechartsDevtools } from '@recharts/devtools';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis, ReferenceLine, Bar, BarChart } from 'recharts';
import { use, useState } from 'react';
import NumericDashBoard from './NumericDashboard.jsx';
import { habitTypeMap } from '../utils/config.js';

const dummyData = [
    { date: 'Nov 1', value: 125 },
    { date: 'Nov 2', value: 70 },
    { date: 'Nov 3', value: 110 }
];

async function getData(dates) {

    const url = `http://localhost:3000/data?dateStart=${dates['dateStart']}&dateEnd=${dates['dateEnd']}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        /* Here we can update the UI to handle the error
        Need some error state and a loading state 
        Or 1 state that manages whether the data is here, loading, dne, or if we hit an error ...
        Use this state with conditional logic when rendering
        Probably want this in the habits component?! */


        console.error(error.message);
    }
}

export default function HabitAnalytics() {
    const [habit, setHabit] = useState('Pushups')
    const [habitType, setHabitType] = useState('counter')
    const dateObj = new Date()
    const [data, setData] = useState(dummyData)
    const [dashboardData, setDashboardData] = useState(dummyData)
    const [dateStart, setDateStart] = useState(dateObj.toLocaleDateString('en-CA'))
    const [dateEnd, setDateEnd] = useState(dateObj.toLocaleDateString('en-CA'))

    async function updateData(dates) {
        let pullData = await getData(dates)
        setData(pullData)
        let finalData = []
        for (let i = 0; i < pullData.length; i++) {
            finalData[i] = {
                date: pullData[i].today,
                value: pullData[i][habit] ?? 0
            }
        }
        console.log("finalData", finalData)
        setDashboardData(finalData)
    }

    function updateHabitDashboard(newHabit) {
        setHabit(newHabit);
        console.log("habit type", habitTypeMap[newHabit])
        setHabitType(habitTypeMap[newHabit])
        let finalData = []
        for (let i = 0; i < data.length; i++) {
            finalData[i] = {
                date: data[i].today,
                value: data[i][newHabit] ?? 0
            }
        }
        console.log(finalData)
        setDashboardData(finalData)
    }

    async function updateDate(setDate, newDate, field) {
        setDate(newDate);

        const dates = {
            dateStart: dateStart,
            dateEnd: dateEnd,
            [field]: newDate
        }
        await updateData(dates)

    }

    return (
        <>
            {habitType}
            {habitType === 'counter' && <NumericDashBoard habit={habit} setHabit={setHabit} dateStart={dateStart} dateEnd={dateEnd} dashboardData={dashboardData} updateHabitDashboard={updateHabitDashboard} />}
            <select value={habit} onChange={(e) => updateHabitDashboard(e.target.value)}>
                <option value='Steps'>Steps</option>
                <option value='Pushups'>Pushups</option>
                <option value='Squats'>Squats</option>
                <option value='Protein'>Protein</option>
                <option value='Bedtime'>Bed time</option>
            </select>
            <br />
            <input aria-label="Date" type="date" name='dateStart' value={dateStart} onChange={e => { updateDate(setDateStart, e.target.value, "dateStart") }} />
            <input aria-label="Date" type="date" name='dateEnd' value={dateEnd} onChange={e => { updateDate(setDateEnd, e.target.value, "dateEnd") }} />

        </>

    )
}