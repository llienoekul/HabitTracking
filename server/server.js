import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import readLastLines from 'read-last-lines';

// Creates a date object representing right now
const today = new Date();
// Formats it to your user's local format (e.g., MM/DD/YYYY)
const formattedToday = today.toLocaleDateString();
const m = today.getMonth() + 1
const y = today.getFullYear()
const d = today.getDate()

const app = express();
const port = 3000;

const corsOptions = {
    origin: 'http://localhost:5173', // Allow only your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP actions
    allowedHeaders: ['Content-Type', 'Authorization'], // Essential for JSON communication
}

app.use(express.json())
app.use(cors(corsOptions))
// check if an entry is empty
function isPlainObjectEmpty(obj) {
    return (
        obj !== undefined &&
        obj !== null &&
        typeof obj === 'object' &&
        obj.constructor === Object &&
        Object.keys(obj).length === 0
    );
}

async function checkIfFileExists(filePath) {
    try {
        // F_OK checks if the file is visible/exists
        await fs.access(filePath);
        return true;
    } catch (error) {
        console.log(filePath + ' File does not exist.');
        return false;
    }
}

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function padDate(date) {
    return String(date).padStart(2, '0')
}

// This builds an empty json object for a new month
async function buildMonthFile(month, year, filepath) {
    let monthData = []
    console.log("month: " + month + ", Year: " + year)
    const days = getDaysInMonth(month, year);
    for (let day = 1; day <= days; day++) {
        let dayStr = padDate(day);
        monthData[day] = { today: `${year}-${month}-${dayStr}` }
    }
    const a = await fs.writeFile(filepath, JSON.stringify(monthData));
}
//Return one day's data
app.get('/date', async (req, res) => {
    const dateInput = req.query.dateInput
    //YYYY-MM-DD
    const yIn = dateInput.substring(0, 4)
    const mIn = dateInput.substring(5, 7)
    const dIn = dateInput.substring(8, 10)
    const filepath = `../data/habits-${yIn}-${mIn}.json`
    const fileExists = await checkIfFileExists(filepath)
    if (!fileExists) {
        res.send('{}');
        return
    }
    let monthData = await fs.readFile(filepath, { encoding: 'utf8' }).then((response) => JSON.parse(response)).catch((e) => console.error(e));
    let data = monthData[Number(dIn)];
    if (!isPlainObjectEmpty(data)) {
        delete data['today']
    }
    res.send(data);

});

//Return habit habit over a passed in time period
app.get('/data', async (req, res) => {
    const dateStart = req.query.dateStart
    const dateEnd = req.query.dateEnd
    let yStart = Number(dateStart.substring(0, 4))
    let mStart = Number(dateStart.substring(5, 7))
    let dStart = Number(dateStart.substring(8, 10))
    let yEnd = Number(dateEnd.substring(0, 4))
    let mEnd = Number(dateEnd.substring(5, 7))
    let dEnd = Number(dateEnd.substring(8, 10))

    let data = []
    if (yStart === yEnd && mStart === mEnd) {
        let filepath = `../data/habits-${yStart}-${padDate(mStart)}.json`
        let fileExists = await checkIfFileExists(filepath)
        if (!fileExists) {
            res.send('{}');
            return
        }
        let monthData = await fs.readFile(filepath, { encoding: 'utf8' }).then((response) => JSON.parse(response)).catch((e) => console.error(e));
        data.push(...monthData.slice(dStart, dEnd + 1))
    }
    else {
        let filepath = `../data/habits-${yStart}-${padDate(mStart)}.json`
        let fileExists = await checkIfFileExists(filepath)
        if (!fileExists) {
            res.send('{}');
            return
        }
        let monthData = await fs.readFile(filepath, { encoding: 'utf8' }).then((response) => JSON.parse(response)).catch((e) => console.error(e));
        data.push(...monthData.slice(dStart, Number(getDaysInMonth(mStart, yStart)) + 1))
        console.log('month 1: ' + data)

        let y = yStart
        let m = mStart + 1
        while (y < yEnd || m < mEnd) {
            console.log('while')
            filepath = `../data/habits-${y}-${padDate(m)}.json`
            fileExists = await checkIfFileExists(filepath)
            if (!fileExists) {
                res.send('{}');
                return
            }
            monthData = await fs.readFile(filepath, { encoding: 'utf8' }).then((response) => JSON.parse(response)).catch((e) => console.error(e));
            data.push(...monthData.slice(1, (monthData.length)))
            m++
            if (m > 12) {
                m = 1
                y++
            }
        }
        filepath = `../data/habits-${yEnd}-${mEnd}.json`
        fileExists = await checkIfFileExists(filepath)
        if (!fileExists) {
            res.send('{}');
            return
        }
        monthData = await fs.readFile(filepath, { encoding: 'utf8' }).then((response) => JSON.parse(response)).catch((e) => console.error(e));
        data.push(...monthData.slice(1, dEnd + 1))
        console.log('final: ' + data)
    }
    res.send(data);
});

app.post('/', async (req, res) => {
    let habitData = req.body
    const saveDate = habitData['saveDate']
    const yIn = saveDate.substring(0, 4)
    const mIn = saveDate.substring(5, 7)
    const dIn = saveDate.substring(8, 10)
    const filepath = `../data/habits-${yIn}-${mIn}.json`

    delete habitData['saveDate']
    habitData['MorningRoutine'] = 'MorningRoutine' in habitData
    habitData['ReadChapter'] = 'ReadChapter' in habitData
    habitData['Sleep'] = 'Sleep' in habitData
    const fileExists = await checkIfFileExists(filepath)

    if (!fileExists) { await buildMonthFile(mIn, yIn, filepath) }

    let monthData = await fs.readFile(filepath, { encoding: 'utf8' }).then((response) => JSON.parse(response)).catch((e) => console.error(e));
    monthData[Number(dIn)] = habitData;
    const a = await fs.writeFile(filepath, JSON.stringify(monthData, null, 2));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});