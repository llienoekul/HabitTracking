export default function Habit({ habit, progress, habitType, updateHabitProgress, key }) {
    let returnJSX = <>NoCase</>
    //console.log(habit + ", " + habitType + ", " + progress )
    switch (habitType) {
        case "counter":
            returnJSX = <input name={habit} key={habit} type="number" value={progress} onChange={
                e => {updateHabitProgress(habit, e.target.value)}}></input>
            break;
        case "checkbox":
            returnJSX = <input name={habit} key={habit} type="checkbox" value={progress} checked={progress} onChange={
                e => {updateHabitProgress(habit, e.target.checked)}}></input>
            break;
        case "timeCheck":
            returnJSX = <input name={habit} key={habit} type="time" value={progress} onChange={
                e => {updateHabitProgress(habit, e.target.value)}}></input>
    }
    return (returnJSX)
}