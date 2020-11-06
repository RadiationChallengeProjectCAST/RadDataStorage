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
try {
    await client.query("BEGIN")
    tokens.teams.forEach(element => {
        var response = await client.query({
            text: 'INSERT INTO Team(teamtoken, teamname) VALUES($1, $2)',
            values: [element.token, element.teamName]
        })
        console.log(response)
    });
    client.query("COMMIT")
} catch (error) {
    console.log(error)
    await client.query("ROLLBACK")
}

var stdin = process.openStdin(); 
require('tty').setRawMode(true);    

console.log('Press any key to exit');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));