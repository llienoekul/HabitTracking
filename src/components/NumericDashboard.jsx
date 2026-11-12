import { useState } from 'react';
import NumericChart from './NumericChart';

export default function NumericDashBoard({ habit, setHabit, dashboardData, updateHabitDashboard, dateStart, dateEnd, updateData}) {


    return (
        <>
            <h2>Data from {dateStart} to {dateEnd} for {habit}</h2>
            <div className='NumericDashboard'>
                <NumericChart data={dashboardData} habit={habit} />
            </div>
        </>

    )
}