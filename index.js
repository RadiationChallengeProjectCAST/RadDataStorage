var fs = require('fs');
var tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

const express = require('express')
const app = express()
const port = 3000
const HTMLDir = 'pages/'

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// const { Pool } = require('pg');
// const { query } = require('express');
// const client = new Pool({
//     user: "raddbaccess",
//     host: "localhost",
//     database: "radiationdb",
//     password: tokens.DBPassword,
//     port: "5432"
// });

// client.connect();

function servePage(path, res){
    console.log("1");
    fs.readFile(path, function(err, data){
        console.log("2");
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
}

app.get('/api/upload_data', async (req, res) => {
    //Token verification
    if (req.is('json')){
        var token = req.body.token;
        var cpm = req.body.reading.cpm;
        var floor = req.body.reading.location.floor;
        var locX = req.body.reading.location.x;
        var locY = req.body.reading.location.y;
    } else {
        var token = req.query.token;
        var cpm = req.query.cpm;
        var floor = req.query.floor;
        var locX = req.query.x;
        var locY = req.query.y;
    }
    
    res.send (token + " | " + cpm + " | " + floor + " | " + locX + " | " + locY);

    // const result = await client.query({
    //     text: 'SELECT TeamID FROM Team WHERE TeamToken = $1',
    //     values: [token],
    // })

    // if (result.rowCount == 0) {
    //     res.send("Invalid token.")
    //     return;
    // }
    
    // let teamID = result.rows[0].teamid;

    // var insertQuery = "INSERT INTO reading (teamid, posfloor, posx, posy, cpm) VALUES ($1, $2, $3, $4, $5);"
    // var values = [teamID, floor, locX, locY, cpm]

    // try {
    //     await client.query('BEGIN')
    //     const response = await client.query(insertQuery, values)
    //     console.log(response.rows[0])
    //     res.send("Data submitted sucessfully. cpm: " + cpm + " floor: " + floor + " locX: " + locX + " locY: " + locY + "teamID: " + teamID);
    //     await client.query('COMMIT')

    // } catch (err) {
    //     console.log(err.stack)
    //     res.send("Error commiting to db.");
    //     await client.query('ROLLBACK')
    // }
    
});

app.get('/api/readings', async (req, res) => {

    queryText = 'SELECT * FROM reading JOIN team ON reading.teamid = team.teamid'

    if (req.query.teamid) {
        var TeamID = req.query.teamID;
        queryText = "SELECT * FROM reading JOIN team on reading.teamid = team.teamid WHERE teamid = " + teamID
    }

    const result = await client.query({
        text: queryText
    })

    let response = new Array();
    result.rows.forEach(function(reading) {
        response.push({
            "teamid" : reading.teamid,
            "teamname": reading.teamname,
            "reading" : {
                "cpm": reading.cpm,
                "location": {
                    "floor": reading.posfloor,
                    "x": reading.posx,
                    "y": reading.posy
                }
            }
        })
    });

    res.send(response);
});

app.get('/record', (req, res) => {
    // Serve record.html
    servePage(HTMLDir+'record.html', res);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})