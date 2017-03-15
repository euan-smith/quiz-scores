/**
 * Created by euans on 05/03/2017.
 */
var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var cn = {
  host: 'localhost',
  port: 5432,
  database: 'quiz_scores',
  user: 'quiz_master'
};
var db = pgp(cn);

function makeApiGroupedSet(table, item, pkeys, types){
  const keys=Object.keys(types).concat(pkeys);
  const eqMap=k=>k+'=${'+k+'}';
  const eqKeys = pkeys.map(eqMap).join(',');
  const params = keys.map(k=>'${'+k+'}').join(',');
  const upsert = 'IF NOT EXISTS (SELECT * FROM '+table+' WHERE '+eqKeys +')'+
    ' INSERT INTO '+table+'('+keys.join(',')+')' +
    ' VALUES('+params+') RETURNING *' +
    ' ELSE' +
    ' UPDATE '+table+
    ' SET ' + keys.map(eqMap).join(',')+
    ' WHERE '+eqKeys +
    ' RETURNING *';

  return {
    putOne(req, res, next){
      for(let t of keys)
        if (types[t] && typeof req.body[t] === "undefined") req.body[t]=types[t];
      db.one(upsert, req.body)
        .then(function (data) {
          res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Put ONE '+item
            });
        })
        .catch(function (err) {
          return next(err);
        });
    },

    getAll(req, res, next){
      let queries = Object.keys(req.query);
      if (queries.length){
        queries=' WHERE '+queries.map(q=>q+'=${'+q+'}').join(',')
      } else queries='';
      db.any('select * from '+table+queries,req.query)
        .then(function (data) {
          res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ALL '+table
            });
        })
        .catch(function (err) {
          return next(err);
        });
    },

    deleteAll(req, res, next){
      let queries = Object.keys(req.query);
      if (queries.length){
        queries=' WHERE '+queries.map(q=>q+'=${'+q+'}').join(',')
      } else queries='';
      db.none('delete from '+table+queries,req.query)
        .then(function () {
          res.status(200)
            .json({
              status: 'success',
              message: 'Deleted selected '+table
            });
        })
        .catch(function (err) {
          return next(err);
        });
    }
  }
}

function makeApiSet(table, item, types){
  const keys=Object.keys(types);
  return {
    create(req,res,next){
      for(let t of keys)
        if (types[t] && typeof req.body[t] === "undefined") req.body[t]=types[t];
      db.one('insert into '+table+'('+keys.join(', ')+')' +
        'values('+keys.map(k=>'${'+k+'}').join(', ')+') returning *', req.body)
        .then(function(r){
          res.status(200)
            .json({
              status: 'success',
              message: 'Inserted one '+item,
              data: r
            });
        })
        .catch(function (err) {
          return next(err);
        });
    },

    getOne(req, res, next){
      var id = parseInt(req.params[item]);
      db.one('select * from '+table+' where '+item+'_id = $1', id)
        .then(function (data) {
          res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ONE '+item
            });
        })
        .catch(function (err) {
          return next(err);
        });
    },

    getAll(req, res, next){
      let queries = Object.keys(req.query);
      if (queries.length){
        queries=' WHERE '+queries.map(q=>q+'=${'+q+'}').join(',')
      } else queries='';
      db.any('select * from '+table+queries,req.query)
        .then(function (data) {
          res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ALL '+table
            });
        })
        .catch(function (err) {
          return next(err);
        });
    },

    modify(req, res, next){
      req.body.id = parseInt(req.params[item]);
      let sets=[];
      for (let t of keys){
        if (typeof req.body[t] !== "undefined") sets.push(t+'=${'+t+'}');
      }
      if (!sets.length) return next(new Error('modify with no valid body'));
      db.one('update '+table+' set '+sets.join(',')+' where '+item+'_id = ${id} returning *', req.body)
        .then(function (data) {
          res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Modified ONE '+item
            });
        })
        .catch(function (err) {
          return next(err);
        });

    },

    deleteOne(req, res, next){
      var id = parseInt(req.params[item]);
      db.none('delete from '+table+' where '+item+'_id = $1', id)
        .then(function () {
          res.status(200)
            .json({
              status: 'success',
              message: 'Deleted ONE '+item
            });
        })
        .catch(function (err) {
          return next(err);
        });
    }
  }
}

module.exports={
  makeApiSet,
  makeApiGroupedSet
};