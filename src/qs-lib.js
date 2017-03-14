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
