import Habit from './Habit'
import { useState, useEffect } from 'react'
import { habitTypeMap, initValues, targets } from '../utils/config'
import { checkHabit } from '../utils/utils'
export default function Habits() {

    const date = new Date()
    const m = date.getMonth() + 1
    const y = date.getFullYear()
    let d = date.getDate()
    if (d < 10) { d = `0${d}` }
    if (m < 10) { m = `0${m}` }
    const today = `${y}-${m}-${d}`;

    const [habitProgress, setHabitProgress] = useState(initValues);
    const [dateInput, setdateInput] = useState(today);

    function updateHabitProgress(habitName, newValue) {
        setHabitProgress({ ...habitProgress, [habitName]: newValue });
    }

    async function loadNewData() {
        let newData = await getData(dateInput)
        if (Object.keys(newData).length == 0) {
            newData = initValues
        }
        setHabitProgress(newData);
    }
    useEffect(() => { loadNewData() }, [dateInput])


    async function getData(dateInput) {
        const url = `http://localhost:3000/date?dateInput=${dateInput}`;
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
            Probably want this in the habits component?!
            */
            console.error(error.message);
        }
    }



    function checkHabits(habitsProgress) {

        let returnJSX = <>All goals were hit Today! See you tomorrow</>;
        for (const [habit, habitValue] of Object.entries(habitsProgress)) {
            if (!checkHabit(habit, habitValue)) {
                returnJSX = <>Still work to be done!</>;
            }
        }
        return returnJSX;
    }

    async function saveHabitsData(formData) {
        const url = 'http://localhost:3000/'
        const rawData = Object.fromEntries(formData.entries());
        // Convert FormData into a plain JavaScript object
        rawData['today'] = dateInput
        const jsonPayload = JSON.stringify(rawData);
        try {
            const response = await fetch(url, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: jsonPayload,
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.text();
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <>
            <h1>Daily Habit Progress {dateInput}</h1>
            <div className="routine">
                Morning Routine
                <ul>
                    <li>20 pushups</li>
                    <li>15 squats</li>
                    <li>Make your bed</li>
                    <li>Brush teeth AND mouthwash</li>
                </ul>
            </div>

            <div className="routine">
                Bedtime Routine
                <ul>
                    <li>10 - 10:15 Complete pushups and Squats + stretch 5 minutes! </li>
                    <li>10:15 - 10:30 Get ready for bed: Bathroom (brush teeth, floss, wash face ...), change into pjs</li>
                    <li>10:30 - 10:45 Read chapter for the day if not done</li>
                    <li><b>10:45 15 minute warning</b></li>
                    <li>10:45 - 11 extra time if needed</li>
                </ul>
            </div>
            <h2>Habit Progress for {dateInput}</h2>
            <input aria-label="Date" type="date" id='date' value={dateInput} onChange={e => { setdateInput(e.target.value) }} />

            <form action={saveHabitsData}>
                <table>
                    <thead>
                        <tr>
                            {Object.entries(habitProgress).map(([key, value]) => (
                                <td key={key}>{key}</td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {Object.entries(habitProgress).map(([key, value]) => (
                                <td key={key}>
                                    <Habit habit={key} progress={value} habitType={habitTypeMap[key]} updateHabitProgress={updateHabitProgress} />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <input type="hidden" value={dateInput} name="saveDate"></input>
                <button type='submit'>Save progress</button>
            </form>
            <h3>{checkHabits(habitProgress)}</h3>

        </>


    )

}

