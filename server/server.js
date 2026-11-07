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

async function checkIfFileExists(filePath) {
    try {
        // F_OK checks if the file is visible/exists
        await fs.access(filePath);
        return true;
    } catch (error) {
        console.log('File does not exist.');
        return false;
    }
}

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}


// This builds an empty json object for a new month
async function buildMonthFile(filepath) {
    
    let monthData = {}
    const days = getDaysInMonth(m, y);
    for (let day = 1; day <= days; day++) {
        monthData[day] = {}
    }
    const a = await fs.writeFile(filepath, JSON.stringify(monthData));
}
//Return one day's data
app.get('/date', async (req, res) => {
    const dateInput = req.query.dateInput
    //YYYY-MM-DD
    const yIn = dateInput.substring(0, 4)
    const mIn = dateInput.substring(5, 7)
    const dIn = dateInput.substring(9, 11)
    const filepath = `../data/habits-${yIn}-${mIn}.json`
    const fileExists = await checkIfFileExists(filepath)
    if (!fileExists) { 
        res.send('{}');
        return
    }
    let monthData = await fs.readFile(filepath, { encoding: 'utf8' }).then((response) => JSON.parse(response)).catch((e) => console.error(e));
    let data = monthData[dIn];
    delete data['today']
    res.send(data);

});

app.post('/', async (req, res) => {
    let habitData = req.body
    const saveDate = habitData['saveDate']
    const yIn = saveDate.substring(0, 4)
    const mIn = saveDate.substring(5, 7)
    const dIn = saveDate.substring(9, 11)
    const filepath = `../data/habits-${yIn}-${mIn}.json`

    delete habitData['saveDate']
    habitData['MorningRoutine'] = 'MorningRoutine' in habitData
    habitData['ReadChapter'] = 'ReadChapter' in habitData
    habitData['Sleep'] = 'Sleep' in habitData
    const fileExists = await checkIfFileExists(filepath)
    
    if (!fileExists) { await buildMonthFile(filepath) }

    let monthData = await fs.readFile(filepath, { encoding: 'utf8' }).then((response) => JSON.parse(response)).catch((e) => console.error(e));
    monthData[dIn] = habitData;
    const a = await fs.writeFile(filepath, JSON.stringify(monthData, null, 2));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});