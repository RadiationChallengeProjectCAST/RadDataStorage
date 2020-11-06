var fs = require('fs');
var tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

const { Pool } = require('pg')
const client = new Pool({
    user: "raddbaccess",
    host: "localhost",
    database: "radiationdb",
    password: tokens.DBPassword,
    port: "5432"
});


client.connect();

tokens.teams.forEach(
    element => {
        var response = client.query({
            text: 'INSERT INTO Team(teamtoken, teamname) VALUES($1, $2)',
            values: [element.token, element.teamName]
        }).catch(e => console.error(e.stack))
    });


