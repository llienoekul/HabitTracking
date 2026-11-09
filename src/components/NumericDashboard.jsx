import { useState } from 'react';
import NumericChart from './NumericChart';
const dummyData = [
    { date: 'Nov 1', value: 125 },
    { date: 'Nov 2', value: 70 },
    { date: 'Nov 3', value: 110 }
];

async function getData(formData) {
    console.log(formData)
    const rawData = Object.fromEntries(formData.entries());
    const url = `http://localhost:3000/data?dateStart=${rawData['dateStart']}&dateEnd=${rawData['dateEnd']}`;

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




export default function NumericDashBoard() {
    const dateObj = new Date()
    const [data, setData] = useState(dummyData)
    const [dashboardData, setDashboardData] = useState(dummyData)
    const [habit, setHabit] = useState('Pushups')
    const [dateStart, setDateStart] = useState(dateObj.toLocaleDateString('en-CA'))
    const [dateEnd, setDateEnd] = useState(dateObj.toLocaleDateString('en-CA'))

    async function updateData(formData) {
        let pullData = await getData(formData)
        setData(pullData)
        let finalData = []
        for (let i = 0; i < pullData.length; i++) {
            finalData[i] = {
                date: pullData[i].today,
                value: pullData[i][habit] ?? 0
            }
        }
        setDashboardData(finalData)
    }

    async function updateHabitDashboard(newHabit) {
        setHabit(newHabit);
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

    return (
        <>
            <h2>Data from {dateStart} to {dateEnd} for {habit}</h2>
            <div className='NumericDashboard'>
                <NumericChart data={dashboardData} habit={habit} />
            </div>
            <form action={updateData}>

                <input aria-label="Date" type="date" name='dateStart' value={dateStart} onChange={e => { setDateStart(e.target.value) }} />
                <input aria-label="Date" type="date" name='dateEnd' value={dateEnd} onChange={e => { setDateEnd(e.target.value) }} />
                <button type='submit'>Load data for selected time period</button>
            </form>
            <br />
            <select value={habit} onChange={(e) => updateHabitDashboard(e.target.value)}>
                <option value='Steps'>Steps</option>
                <option value='Pushups'>Pushups</option>
                <option value='Squats'>Squats</option>
                <option value='Protein'>Protein</option>
            </select>
            <br />
        </>

    )
}