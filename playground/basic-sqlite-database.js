var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
  'dialect': 'sqlite',
  'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo',{
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len:[1,250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

sequelize.sync({force:false}).then(function () {
  console.log('Everthing is synced');
  Todo.find({
    where:{
      id:2
    }
  })

  // Todo.create({
  //   description: "Take out trash",
  //   completed: false
  // })
  // .then(function(todo){
  //   return Todo.create({
  //     description:"Clean the office"
  //   });
  // })
  // .then(function(){
  //   return Todo.findAll({
  //     where:{
  //       completed:false
  //     }
  //   })
  // })
  // .then(function(todos){
  //   if(todos){
  //     todos.forEach(function (todo) {
  //       console.log(todo.toJSON());
  //     })
  //   } else {
  //     console.log("no todos found !")
  //   }
  // })
  .then(function (todo) {
    console.log('Finished !');
    console.log(todo.toJSON());
  }).catch(function (e) {
    console.log(e);
  });
})
