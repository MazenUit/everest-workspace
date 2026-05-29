## Routes: 
- HTTP only 
— JSON in/out 
- Status codes.

## endpoints

GET  /health                       200  API running
GET  /lockers                      200  list lockers + availability
POST /packages/store               201  stored | 400 bad size | 409 no locker
POST /lockers/:lockerId/retrieve   200 | 400 | 403 | 404