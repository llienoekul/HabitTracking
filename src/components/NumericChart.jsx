// Function to determine color of the bar

import { RechartsDevtools } from '@recharts/devtools';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis, ReferenceLine, Bar, BarChart } from 'recharts';
import { checkHabit } from '../utils/utils';
import {targets} from '../utils/config'

export default function NumericChart({ data, habit }) {
    const colorBar = (props) => {
        const { x, y, width, height, payload } = props;
        let bool = ''

        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={checkHabit(habit, payload.value) ? '#0D9488' : '#F59E0B'}
            />
        );
    };
    return (
        <>
            <BarChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={data}>
                <Bar dataKey="value" fill='blue' shape={colorBar} />
                <ReferenceLine
                    y={targets[habit]}
                    label={{ value: 'Daily goal', position: 'insideTopRight' }}
                    stroke="red"
                    strokeDasharray="3 3"
                />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsDevtools />
            </BarChart>
        </>
    )

}