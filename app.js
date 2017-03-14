var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var api = require('./db/api');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

function makeTableApi(root, table, item, types){
  const set = api.makeApiSet(table,item,types);
  const tablePath = `${root}/${table}`.toLowerCase();
  const itemPath = `${tablePath}/:${item}`.toLowerCase();
  console.log('register '+tablePath+' and '+itemPath);
  app.get(tablePath,set.getAll);
  app.post(tablePath,set.create);
  app.get(itemPath,set.getOne);
  app.patch(itemPath,set.modify);
  app.delete(itemPath,set.deleteOne);
}

makeTableApi('/api/v1','Quizzes','quiz',{quiz_title:undefined, quiz_description:'-', quiz_date:'1970-01-01'});
makeTableApi('/api/v1','Teams','team',{team_name:undefined});
makeTableApi('/api/v1','Rounds','round',{round_title:undefined, can_play_joker:true});

// app.use(function(req, res, next) {
//   console.log(req.url+" not found");
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500).send(err.message);
});

app.listen(3000, function(err){
  if (err) console.error(err);
  else console.log('listening on port 3000');
});
