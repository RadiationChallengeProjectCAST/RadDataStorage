var fs = require('fs');
var tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const { Pool } = require('pg')
const client = new Pool({
    user: "raddbaccess",
    host: "localhost",
    database: "radiationdb",
    password: tokens.password,
    port: "5432"
});

client.connect();

app.post('/api/upload_data', async (req, res) => {
    //Token verification
    var token = req.body.id;

    const result = await client.query({
        text: 'SELECT TeamID FROM Team WHERE TeamToken = $1',
        values: [token],
    })

    if (result.rowCount == 0) {
        res.send("Invalid token.")
        return;
    }
    var teamID = result.rows[0].TeamID

    var cpm = req.body.reading.cpm;
    var floor = req.body.reading.location.floor;
    var locX = req.body.reading.location.x;
    var locY = req.body.reading.location.y;

    var insertQuery = "INSERT INTO Reading (TeamID, PosFloor, PosX, PosY, CPM) VALUES ($1, $2, $3, $4, $5);"
    var values = [teamIID, floor, locX, locY, cpm]

    try {
        await client.query('BEGIN')
        const res = await client.query(text, values)
        console.log(res.rows[0])
        res.send("Data submitted sucessfully. cpm: " + cpm + " floor: " + floor + " locX: " + locX + " locY: " + locY + "teamID: " + teamID);
        await client.query('COMMIT')
    } catch (err) {
        console.log(err.stack)
        res.send("Error commiting to db.");
        await client.query('ROLLBACK')
    }
    
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})