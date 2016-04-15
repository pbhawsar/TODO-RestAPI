    var express = require('express');
    var app = express();
    var PORT = process.env.PORT || 3000;
    var todos = [{
        id: 1,
        description: 'Do NodeJS programming',
        completed: false
    }, {
        id: 2,
        description: 'Go to market',
        complete: false
    }, {
        id: 3,
        description: 'Eat food.....',
        complete: true
    }];

    var middleware = require('./middleware.js');

    app.use(middleware.logger);

    //app.get('/', function (req, res) {
    //    res.send('TODO API Root !');
    //});

    // GET /todos
    app.get('/todos', function (req, res) {
        res.json(todos);
    });
    // GET /todos/:id
    app.get('/todos/:id', function (req, res) {
        var todoId = parseInt(req.params.id, 10);
        var matchedTodo;
        // iterate over todos array and find match
        todos.map(function (obj) {
            if (todoId === obj.id) {
                matchedTodo = obj;
            }

        })
        // object is truthy
        // undefined is falsy
        if (matchedTodo) {
            res.json(matchedTodo);
        } else {
            res.status(404).send();
        }

    });

    app.use(express.static(__dirname + '/public'));

    app.listen(PORT, function () {
        console.log('Express server started on port ' + PORT + '!');
    });