CREATE ROLE raddbaccess WITH LOGIN PASSWORD 'PUT_DB_PASSWORD_HERE';
CREATE DATABASE radiationdb OWNER raddbaccess;

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

-- CREATE TABLE apilog (
--     logid SERIAL PRIMARY KEY,
--     readingid INTEGER,
--     logtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

INSERT INTO reading (teamid, posfloor, posx, posy, cpm)
    VALUES ([TeamID], [PosFloor], [PosX], [PosY], [CPM]);

INSERT INTO team (teamtoken, teamname)
    VALUES ([TeamToken], [TeamName]);

-- INSERT INTO apilog (readingid)
--     VALUES ([readingid]);