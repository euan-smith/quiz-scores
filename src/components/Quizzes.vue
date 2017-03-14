<template>
  <div class="page">
    <h1 class="page-title">Quiz List</h1>
    <table class="page-list">
      <tr>
        <th>id</th>
        <th>title</th>
        <th>description</th>
        <th>date</th>
        <th></th>
      </tr>
      <tr v-for="quiz of quizzes">
        <td>{{quiz.quiz_id}}</td>
        <td>{{quiz.quiz_title}}</td>
        <td>{{quiz.quiz_description}}</td>
        <td>{{quiz.quiz_date.toDateString()}}</td>
        <td><button>Modify</button><button>Delete</button></td>
      </tr>
      <tr>
        <td></td>
        <td><input v-model="newTitle"></td>
        <td><input v-model="newDesc"></td>
        <td><input v-model="newDate"></td>
        <td><button @click.prevent="add">Add</button></td>
      </tr>
    </table>
    <div class="page-footer"></div>
  </div>
</template>

<script>
  import {getQuiz, getQuizzes, createQuiz, modifyQuiz, deleteQuiz} from '../qs-lib';
  export default {
    name: 'hello',
    data () {
      return {
        newTitle:"quiz title",
        newDesc:"a pub quiz",
        newDate:(new Date()).toDateString(),
        quizzes:[]
      };
    },
    created(){
      this.update();
    },
    methods:{
      update(){getQuizzes().then(r=>{
        this.quizzes=r.data.data.map(q=>{
          q.quiz_date=(new Date(q.quiz_date));
          return q;
        })
      })},
      add(){return createQuiz(this.newTitle, this.newDate, this.newDesc).then(()=>this.update())}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  input,button{
    padding:0.25rem;
    margin: 0.25rem;
  }
  table{
    border: 1px #888 solid;
  }
</style>
