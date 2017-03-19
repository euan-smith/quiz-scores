/**
 * Created by euans on 19/03/2017.
 */
var bodyParser = require('body-parser');
var dbApi = require('./db-api');

module.exports=function(app)
{
  app.use(require('cors')());

  app.use(bodyParser.json());

  function makeTableApi(root, table, item, types) {
    const set = dbApi.makeApiSet(table, item, types);
    const tablePath = `${root}/${table}`.toLowerCase();
    const itemPath = `${tablePath}/:${item}`.toLowerCase();
    app.get(tablePath, set.getAll);
    app.post(tablePath, set.create);
    app.get(itemPath, set.getOne);
    app.patch(itemPath, set.modify);
    app.delete(itemPath, set.deleteOne);
  }

  makeTableApi('/api/v1', 'Quizzes', 'quiz', {quiz_title: undefined, quiz_description: '-', quiz_date: '1970-01-01'});
  makeTableApi('/api/v1', 'Teams', 'team', {team_name: undefined, quiz_id: -1});
  makeTableApi('/api/v1', 'Rounds', 'round', {
    round_title: undefined,
    can_play_joker: true,
    quiz_id: -1,
    round_order: -1
  });

  function makeGroupApi(root, table, item, pkeys, types) {
    const set = dbApi.makeApiGroupedSet(table, item, pkeys, types);
    const tablePath = `${root}/${table}`.toLowerCase();
    app.get(tablePath, set.getAll);
    app.put(tablePath, set.putOne);
    app.delete(tablePath, set.deleteAll);
  }

  makeGroupApi('/api/v1', 'Scores', 'score', ['team_id', 'round_id', 'quiz_id'], {score: 0, applied: false});
  makeGroupApi('/api/v1', 'Jokers', 'joker', ['team_id', 'quiz_id'], {round_id: -1});


  const messages = [];
  app.post('/api/v1/messages/enqueue', function (req, res) {
    messages.push(req.body);
    res.send('OK');
  });

  app.get('/api/v1/messages', function (req, res) {
    res.send(messages);
  });

  app.post('/api/v1/messages/dequeue', function (req, res) {
    res.send(messages.splice(0, 1));
  });

  let state = null;
  app.put('/api/v1/app-state', function (req, res) {
    state = req.body;
    res.send('OK');
  });

  app.get('/api/v1/app-state', function (req, res) {
    res.send(state);
  });


  app.use(function (req, res, next) {
    console.log(req.url + " not found");
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;

    // render the error page
    res.status(err.status || 500).send(err.message);
  });
};