var fs = require('fs');
var tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

const { Pool } = require('pg')
const client = new Pool({
    user: tokens.DBUserName,
    host: "localhost",
    database: tokens.DBName,
    password: tokens.DBUserPassword,
    port: "5432"
});


client.connect();

client.query({ text: 'CREATE TABLE reading ( readingid SERIAL PRIMARY KEY, teamid INT, posfloor INT, posx DECIMAL, posy DECIMAL, cpm DECIMAL, datetimerecorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP);' })
.then (client.query({ text: 'CREATE TABLE team (teamid SERIAL PRIMARY KEY, teamtoken VARCHAR(32), teamname VARCHAR(32));'}).catch(e => console.error(e.stack).then(
    
))
)
.catch(e => console.error(e.stack))

function setupTeams(){
tokens.teams.forEach(
    element => {
        var response = client.query({
            text: 'INSERT INTO team(teamtoken, teamname) VALUES($1, $2)',
            values: [element.token, element.teamName]
        }).catch(e => console.error(e.stack))
    });
}
setTimeout(setupTeams, 3000);

