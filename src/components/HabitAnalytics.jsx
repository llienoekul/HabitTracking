import { RechartsDevtools } from '@recharts/devtools';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis, ReferenceLine, Bar, BarChart } from 'recharts';
const data = [
    { date: 'Nov 1', pushups: 125 },
    { date: 'Nov 2', pushups: 70 },
    { date: 'Nov 3', pushups: 110 }
];

// Function to determine color of the bar
const colorBar = (props) => {
    const { x, y, width, height, payload } = props;
    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={payload.pushups >= 100 ? '#0D9488' : '#F59E0B'}
        />
    );
};

export default function HabitAnalytics() {
    return (
        <div className='Analytics'>
            <BarChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={data}>
                <Bar dataKey="pushups" fill='blue' shape={colorBar} />
                <ReferenceLine
                    y={100}
                    label={{ value: 'Daily goal', position: 'insideTopRight' }}
                    stroke="red"
                    strokeDasharray="3 3"
                />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsDevtools />
            </BarChart>
        </div>

    )
}