import {targets, habitTypeMap} from './config'
export function checkHabit(habit, habitProgress) {
    const habitGoal = targets[habit]
    const habitType = habitTypeMap[habit]
    switch (habitType) {
        case "timeCheck":
            return Temporal.PlainTime.compare(habitProgress, habitGoal) < 1
        default:
            return habitProgress >= habitGoal
    }

}