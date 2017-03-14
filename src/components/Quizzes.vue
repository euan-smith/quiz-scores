<template>
  <div class="page">
    <h2 class="page-title">Quiz List</h2>
    <div class="page-list">
    <table>
      <tr>
        <th>id</th>
        <th>title</th>
        <th>description</th>
        <th>date</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr v-for="quiz of quizzes">
        <td><input v-model="quiz.quiz_id" style="width: 3em" disabled></td>
        <td><input v-model="quiz.quiz_title" @keyup.enter.prevent="modify(quiz.quiz_id)"> </td>
        <td><input v-model="quiz.quiz_description" @keyup.enter.prevent="modify(quiz.quiz_id)"> </td>
        <td><input v-model="quiz.quiz_date" @keyup.enter.prevent="modify(quiz.quiz_id)"> </td>
        <td><button @click.prevent="modify(quiz.quiz_id)">Modify</button></td>
        <td><button @click.prevent="remove(quiz.quiz_id)">Delete</button></td>
        <td><a :href="`#/quizzes/${quiz.quiz_id}/rounds`">rounds</a></td>
        <td><a :href="`#/quizzes/${quiz.quiz_id}/teams`">teams</a></td>
        <td><a :href="`#/quizzes/${quiz.quiz_id}/scores`">scores</a></td>
      </tr>
      <tr class="add-row">
        <td></td>
        <td><input v-model="newTitle"></td>
        <td><input v-model="newDesc"></td>
        <td><input v-model="newDate"></td>
        <td><button @click.prevent="add">Add</button></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
    </div>
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
          q.quiz_date=(new Date(q.quiz_date).toDateString());
          return q;
        }).sort((a,b)=>a.quiz_id-b.quiz_id);
      })},
      add(){return createQuiz(this.newTitle, this.newDate, this.newDesc).then(()=>this.update())},
      remove(id){return deleteQuiz(id).then(()=>this.update())},
      modify(id){
        const q=this.quizzes.find(q=>q.quiz_id===id);
        return modifyQuiz(q.quiz_id,q).then(()=>this.update());
      }
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
  input{
    background: transparent;
  }
  tr:nth-child(even) {background: #fff}
  tr>th{
    border-bottom: 1px #000 solid;
  }
  tr.add-row>td{
    border-top: 1px #000 solid;
  }
  td{
    white-space: nowrap;
  }
  .page-list{
    overflow:auto;
  }
</style>
