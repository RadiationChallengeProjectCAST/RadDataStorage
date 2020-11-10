const dotenv = require('dotenv');

dotenv.config('../');

const { Pool } = require('pg');

function CreatePool() {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.HOST_POSTGRES || 'localhost',
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.PORT_POSTGRES || '5432',
    });

    return pool;
}
exports.CreatePool = CreatePool;
