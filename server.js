var express = require('express');
var bodyParser = require('body-parser');
var middleware = require('./middleware.js');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());
app.use(middleware.logger);


// specify the path for static file
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

//GET /todos?completed=true&q=work
app.get('/todos',function (req, res) {
  var query = req.query;
  var where = {};

  if(query.hasOwnProperty('completed') && query.completed === 'true'){
    where.completed = true;
  } else if(query.hasOwnProperty('completed') && query.completed === 'false'){
    where.completed = false;
  }
  if (query.hasOwnProperty('q') && query.q.length > 0){
    where.description = {
      $like: '%' + query.q + '%'
    };
  }

  db.todo.findAll({where:where})
  .then(function (todos){
    res.json(todos);
  },function(e){
    res.sendStatus(500);
  })
  // var filteredTodos = todos;
  // if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
  //   filteredTodos = _.where(filteredTodos,{completed:true});
  // } else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
  //   filteredTodos = _.where(filteredTodos,{completed:false});
  // }
  // if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
  //   filteredTodos = _.filter(filteredTodos,function(todo){
  //     return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
  //   })
  // }
  //
  // res.json(filteredTodos);
});


//GET /todos
app.get('/todos', function (req, res) {
  res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  // var matchedTodo = _.findWhere(todos,{id:todoId});

  db.todo.findById(todoId)
  .then(function (todo) {
    if(!!todo){
      res.json(todo.toJSON())
    }else {
      res.status(404).send();
    }

 }, function (e) {
   res.status(500).send();
 })
  //
  // if (matchedTodo) {
  //   res.json(matchedTodo);
  // } else {
  //   res.status(404).send();
  // }
});

//POST /todos
app.post('/todos', function (req, res) {
  // sanitize the date to include description and completed only
  var body =   _.pick(req.body,'description','completed');

db.todo.create(body)
.then(function(todo){
  res.status(200).json(todo.toJSON());
  console.log(todo.toJSON());
})
.catch(function (e) {
  res.status(400).json(e);
 console.log(e);
})
  //
  // if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
  //   return res.status(400).send();
  // }
  //
  // // add id field
  // body.id = todoNextId++;
  // body.description =body.description.trim();
  // // push body into array
  // todos.push(body);
  // res.json(body);
});

//DELETE /todos/:id
app.delete('/todos/:id',function(req, res){
  var todoId = parseInt(req.params.id, 10);

        db.todo.destroy({
          where:{
            id:todoId
          }
        })
        .then(function(rowsDeleted){
          if(rowsDeleted === 0){
            res.status(404).json({
              error: 'No matching todo'
            });
          } else {
              res.status(204).send();
            }
          }, function(){
            res.status(500).send();
          });
  // var matchedTodo = _.findWhere(todos,{id:todoId});
  // if(!matchedTodo){
  //   res.status(404).json({"error":"no matching todo id found to be deleted !"});
  // }else{
  //   todos= _.without(todos,matchedTodo);
  //   res.json(matchedTodo);
  // }

});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};

  if (!matchedTodo) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) &&
  body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);
});

db.sequelize.sync({force:false}).then(function () {
  app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
  });
})
