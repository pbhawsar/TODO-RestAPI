# web-server
sample  express web app (TODO app)

This project contains all the rest api implementation for a TODO app. Rest API includes :

Todo model req/res is {"description":"e.g walk the dog","completed":"true"}  
User model req/res is {"email":"some@email.com", "password":"test"}


// GET /todos?completed=false&q=work
Needs authentication to get a list of todos for a authenticated users
// GET /todos/:id
Needs authentication to get a list of todos for a authenticated users
// POST /todos
Need authentication to post a todo object for a authenticated user
// DELETE /todos/:id
Need authenticaiton to delete a specific todo object for a authenticated user
// PUT /todos/:id
Need authentication to update a todo object for a authenticated user
// POST /users
create a user by posting user model
// POST /users/login
login user with email and password using user model you will see a Auth token getting generated copy it and use it for other request
// DELETE /users/login
Need authentication for deleting a user token 
