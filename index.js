const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.post('/api/upload_data', (req, res) => {
  //Token verification
  var token = req.body.id;

  var cpm = req.body.reading.cpm; 
  var floor = req.body.reading.location.floor;
  var locX = req.body.reading.location.x; 
  var locY = req.body.reading.location.y;

  res.send("Data submitted sucessfully. cpm: "+cpm);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})