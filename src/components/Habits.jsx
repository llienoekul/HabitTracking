import Habit from './Habit'
import { useState, useEffect } from 'react'
export default function Habits({ habitTypeMap }) {
    const initValues = {
        Steps: 0,
        Pushups: 0,
        Squats: 0,
        Protein: 0,
        MorningRoutine: false,
        ReadChapter: false,
        Bedtime: '23:59',
        Sleep: false
    }
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
            console.log(result);
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

    function checkHabit(habitProgress, habitGoal, habitType) {
        switch (habitType) {
            case "timeCheck":
                return Temporal.PlainTime.compare(habitProgress, habitGoal) < 1
            default:
                return habitProgress >= habitGoal
        }

    }

    function checkHabits(habitsProgress) {
        const targets = {
            Steps: 5000,
            Pushups: 100,
            Squats: 75,
            Protein: 100,
            MorningRoutine: 1,
            ReadChapter: 1,
            Bedtime: '23:00',
            Sleep: 1
        }
        let returnJSX = <>All goals were hit Today! See you tomorrow</>;
        for (const [habit, habitValue] of Object.entries(habitsProgress)) {
            if (!checkHabit(habitValue, targets[habit], habitTypeMap[habit])) {
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
            console.log(result);
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

