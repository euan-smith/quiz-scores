var express = require('express');
var path = require('path');
var api = require('./db/api');

var app = express();
app.use(express.static(path.join(__dirname, 'dist')));

api(app);

app.listen(3000, function(err){
  if (err) console.error(err);
  else console.log('listening on port 3000');
});
