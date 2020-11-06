var fs = require('fs');
var tokens = JSON.parse(fs.readFileSync('file', 'utf8'));

const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const { Pool } = require('pg')
const client = new Pool({
    user: "radDbAccess",
    host: "localhost",
    database: "radiationDb",
    password: token.password,
    port: "5432"    
  });

client.connect();

app.post('/api/upload_data', (req, res) => {
    //Token verification
    var token = req.body.id;

    var cpm = req.body.reading.cpm;
    var floor = req.body.reading.location.floor;
    var locX = req.body.reading.location.x;
    var locY = req.body.reading.location.y;

    res.send("Data submitted sucessfully. cpm: " + cpm + " floor: " + floor + " locX:" + locX + " locY:" + locY);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})