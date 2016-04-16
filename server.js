    var express = require('express');
    var bodyParser = require('body-parser');
    var middleware = require('./middleware.js');
    var _ = require('underscore');

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

    //GET /todos
    app.get('/todos', function (req, res) {
        res.json(todos);
    });

    //GET /todos/:id
    app.get('/todos/:id', function (req, res) {
        var todoId = parseInt(req.params.id, 10);
        var matchedTodo = _.findWhere(todos,{id:todoId});

        if (matchedTodo) {
            res.json(matchedTodo);
        } else {
            res.status(404).send();
        }
    });

    //POST /todos
    app.post('/todos', function (req, res) {
        // sanitize the date to include description and completed only
        var body =   _.pick(req.body,'description','completed');


        if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
            return res.status(400).send();
        }

        // add id field
        body.id = todoNextId++;
        body.description =body.description.trim();
        // push body into array
        todos.push(body);
        res.json(body);
    });

    //DELETE /todos/:id
    app.delete('/todos/:id',function(req, res){
        var todoId = parseInt(req.params.id, 10);
        var matchedTodo = _.findWhere(todos,{id:todoId});
        if(!matchedTodo){
            res.status(404).json({"error":"no matching todo id found to be deleted !"});
        }else{
            todos= _.without(todos,matchedTodo);
            res.json(matchedTodo);
        }

    });

    app.listen(PORT, function () {
        console.log('Express listening on port ' + PORT + '!');
    });


















