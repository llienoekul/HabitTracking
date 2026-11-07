import Habit from './Habit'

export default function Habits({ dateInput, habitProgress, habitTypeMap, updateHabitProgress }) {

    
    const date = new Date();
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
            <h2>Habit Progress for {dateInput}</h2>
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
        </>


    )

}

