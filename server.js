const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4040;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ clicks: 0, guestbook: [] }));
}

function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- Clicker API ---
app.get('/api/clicks', (req, res) => {
    const data = readData();
    res.json({ clicks: data.clicks });
});

app.post('/api/clicks', (req, res) => {
    const data = readData();
    data.clicks += 1;
    writeData(data);
    res.json({ clicks: data.clicks });
});

// --- Guestbook API ---
app.get('/api/guestbook', (req, res) => {
    const data = readData();
    res.json(data.guestbook);
});

app.post('/api/guestbook', (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) return res.status(400).send('Missing fields');
    
    const data = readData();
    const newEntry = { name, message, date: new Date().toISOString() };
    data.guestbook.unshift(newEntry); // Add to top
    writeData(data);
    res.json(newEntry);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
