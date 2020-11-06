CREATE ROLE radDbAccess WITH LOGIN PASSWORD 'PUT_DB_PASSWORD_HERE';
CREATE DATABASE radiationDb OWNER radDbAccess;

CREATE TABLE Reading (
    ReadingID SERIAL PRIMARY KEY,
    TeamID VARCHAR(8),
    PosFloor INT,
    PosX DECIMAL,
    PosY DECIMAL,
    CPM DECIMAL,
    DateTimeRecorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Team (
    TeamID SERIAL PRIMARY KEY,
    TeamToken VARCHAR(32),
    TeamName VARCHAR(32)
);

INSERT INTO Reading (TeamID, PosFloor, PosX, PosY, CPM)
    VALUES ([TeamID], [PosFloor], [PosX], [PosY], [CPM]);

INSERT INTO Team (TeamToken, TeamName)
    VALUES ([TeamToken], [TeamName]);