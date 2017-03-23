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

exports.createQuiz = function(quiz_title, quiz_date, quiz_description){
  return api.post('/quizzes',{quiz_title, quiz_date, quiz_description});
};

exports.getQuiz = function(quiz_id){
  return api.get(`/quizzes/${quiz_id}`);
};

exports.modifyQuiz = function(quiz_id, data){
  return api.patch(`/quizzes/${quiz_id}`, data)
};

exports.deleteQuiz = function(quiz_id){
  return api.delete(`/quizzes/${quiz_id}`);
};

exports.getQuizRounds = function(quiz_id){
  return api.get('/rounds?quiz_id='+quiz_id);
};

exports.getRounds = function(){
  return api.get('/rounds');
};

exports.createQuizRound = function(quiz_id, round_order, round_title, can_play_joker, sequential){
  return api.post('/rounds',{quiz_id, round_title, round_order, can_play_joker, sequential});
};

exports.getRound = function(round_id){
  return api.get(`/rounds/${round_id}`);
};

exports.modifyRound = function(round_id, data){
  return api.patch(`/rounds/${round_id}`, data)
};

exports.deleteRound = function(round_id){
  return api.delete(`/rounds/${round_id}`);
};

exports.getQuizTeams = function(quiz_id){
  return api.get('/teams?quiz_id='+quiz_id);
};

exports.getTeams = function(){
  return api.get('/teams');
};

exports.createQuizTeam = function(quiz_id, team_name){
  return api.post('/teams',{quiz_id, team_name});
};

exports.getTeam = function(team_id){
  return api.get(`/teams/${team_id}`);
};

exports.modifyTeam = function(team_id, data){
  return api.patch(`/teams/${team_id}`, data)
};

exports.deleteTeam = function(team_id){
  return api.delete(`/teams/${team_id}`);
};

exports.getQuizScores = function(quiz_id){
  return api.get('/scores?quiz_id='+quiz_id);
};

exports.getQuizJokers = function(quiz_id){
  return api.get('/jokers?quiz_id='+quiz_id);
};

exports.deleteQuizScore = function(quiz_id, round_id, team_id){
  return api.delete(`/scores?quiz_id=${quiz_id}&round_id=${round_id}&team_id=${team_id}`)
};

exports.deleteQuizJoker = function(quiz_id, team_id){
  return api.delete(`/jokers?quiz_id=${quiz_id}&team_id=${team_id}`)
};

exports.putQuizScore = function(quiz_id, round_id, team_id, score){
  return api.put('/scores',{quiz_id, round_id, team_id, score})
};

exports.putQuizScoreObj = function(s){
  return api.put('/scores',s)
};

exports.putQuizJoker = function(quiz_id, round_id, team_id){
  return api.put('/jokers',{quiz_id, round_id, team_id})
};


exports.getAppState = function(){
  return api.get('/app-state');
};

exports.setAppState = function(state){
  return api.put('/app-state',state);
};

!function(){
  let ticker=null;
  let listener=null;

  exports.setListener = function(fn){
    listener=fn;
    if (!fn && ticker){
      clearInterval(ticker);
      ticker=null;
    }
    if (fn && !ticker){
      ticker = setInterval(()=>{
        api.post('/messages/dequeue').then(({data:r})=>{
          if (listener && r.length) listener(r[0]);
        })
      },500)
    }
  };

  exports.send = function(item){
    return api.post('/messages/enqueue', item);
  }
}();

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

function dynamicSortMulti(props) {
  return function (obj1, obj2) {
    var i = 0, result = 0, len=props.length;
    /* try getting a different result from 0 (equal)
     * as long as we have extra properties to compare
     */
    while(result === 0 && i < len) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  }
}

exports.dynamicSort=dynamicSort;

exports.dynamicSortMulti=dynamicSortMulti;