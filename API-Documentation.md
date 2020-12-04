# API Documentation
[*Short intro here*]

## Upload Data `POST`
Url: `api/upload_data`

Used for uploading a radiation reading.

```
code example here
```
### Arguments
#### token
Your team's 32 character {?} token. Required for authentication. Don't share this token with anyone else.
#### cpm
Count Per Minute.
#### floor
The floor the reading took place on, from 1 (ground floor) to 4 (roof)
#### x
The x coordinate of the location of the reading, measured from the learning plaza corner of the building (shown as top left on our selector)
#### y
The y coordinate of the location of the reading, measured from the learning plaza corner of the building (shown as top left on our selector)

## Request Readings Data `GET`
Url: `api/readings`

DESCRIPTION HERE
```
code example here
```
### Arguments
#### teamid `OPTIONAL`

## Validate Token `GET`
Url: `api/validateToken`

DESCRIPTION HERE
```
code example here
```
### Arguments
#### token

# NOTES, TODO ETC.
