/**
 * Created by euans on 14/03/2017.
 */

const axios = require('axios');
const apiRoot = 'http://127.0.0.1:3000/api/v1';
const api={
  get:(url, query)=>axios.get(apiRoot+url,{params:query}).catch(e=>console.error(e)),
  post:(url, data)=>axios.post(apiRoot+url, data).catch(e=>console.error(e)),
  patch:(url, data)=>axios.patch(apiRoot+url, data).catch(e=>console.error(e)),
  put:(url, data)=>axios.put(apiRoot+url, data).catch(e=>console.error(e)),
  delete:(url, query)=>axios.delete(apiRoot+url,{params:query}).catch(e=>console.error(e)),
};

exports.getQuizzes = function(){
  return api.get('/quizzes');
};

exports.createQuiz = function(title, date, description){
  return api.post('/quizzes',{quiz_title:title, quiz_date:date, quiz_description:description});
};

exports.getQuiz = function(id){
  return api.get(`/quizzes/${id}`);
};

exports.modifyQuiz = function(id, data){
  return api.patch(`/quizzes/${id}`, data)
};

exports.deleteQuiz = function(id){
  return api.delete(`/quizzes/${id}`);
};

exports.getQuizRounds = function(quiz){
  return api.get('/rounds?quiz_id='+quiz);
};

exports.getRounds = function(){
  return api.get('/rounds');
};

exports.createQuizRound = function(quiz, order, title, joker){
  return api.post('/rounds',{quiz_id:quiz, round_title:title, round_order:order, can_play_joker:joker});
};

exports.getRound = function(id){
  return api.get(`/rounds/${id}`);
};

exports.modifyRound = function(id, data){
  return api.patch(`/rounds/${id}`, data)
};

exports.deleteRound = function(id){
  return api.delete(`/rounds/${id}`);
};

exports.getQuizTeams = function(quiz){
  return api.get('/teams?quiz_id='+quiz);
};

exports.getTeams = function(){
  return api.get('/teams');
};

exports.createQuizTeam = function(quiz, name){
  return api.post('/teams',{quiz_id:quiz, team_name:name});
};

exports.getTeam = function(id){
  return api.get(`/teams/${id}`);
};

exports.modifyTeam = function(id, data){
  return api.patch(`/teams/${id}`, data)
};

exports.deleteTeam = function(id){
  return api.delete(`/teams/${id}`);
};

exports.getQuizScores = function(quiz){
  return api.get('/scores?quiz_id='+quiz);
};

exports.getQuizJokers = function(quiz){
  return api.get('/jokers?quiz_id='+quiz);
};

exports.deleteQuizScore = function(quiz, round, team){
  return api.delete(`/scores?quiz_id=${quiz}&round_id=${round}&team_id=${team}`)
};

exports.deleteQuizJoker = function(quiz, team){
  return api.delete(`/scores?quiz_id=${quiz}&team_id=${team}`)
};

exports.putQuizScore = function(quiz_id, round_id, team_id, score){
  return api.put('/scores',{quiz_id, round_id, team_id, score})
};

exports.putQuizJoker = function(quiz_id, round_id, team_id){
  return api.put('/scores',{quiz_id, round_id, team_id})
};
