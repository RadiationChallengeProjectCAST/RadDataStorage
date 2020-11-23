CREATE TABLE reading (
    readingid SERIAL PRIMARY KEY,
    teamid INT,
    posfloor INT,
    posx DECIMAL,
    posy DECIMAL,
    cpm DECIMAL,
    datetimerecorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team (
    teamid SERIAL PRIMARY KEY,
    teamtoken VARCHAR(32) UNIQUE,
    teamname VARCHAR(32)
);

