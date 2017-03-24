<template>
  <div class="page">
    <h2 class="page-title">Teams for {{quiz.quiz_title}} on {{quiz.quiz_date}}</h2>
    <div class="page-list">
      <table>
        <tr>
          <th>id</th>
          <th>name</th>
          <th></th>
          <th></th>
        </tr>
        <tr v-for="team of teams">
          <td><input v-model="team.team_id" style="width: 3em" disabled></td>
          <td><input v-model="team.team_name" @keyup.enter.prevent="modify(team.team_id)"></td>
          <td><button @click.prevent="modify(team.team_id)">Modify</button></td>
          <td><button @click.prevent="remove(team.team_id)">Delete</button></td>
        </tr>
        <tr class="add-row">
          <td></td>
          <td><input v-model="newName" @keyup.enter.prevent="add"></td>
          <td><button @click.prevent="add">Add</button></td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import {getQuiz, getQuizTeams, createQuizTeam, modifyTeam, deleteTeam} from '../qs-lib';
  export default {
    name: 'teams',
    data () {
      return {
        newName:"team name",
        quiz_id:-1,
        quiz:{},
        teams:[]
      };
    },
    created(){
      this.update();
    },
    methods:{
      update(){
  		document.head.querySelector('title').innerHTML="Teams";
        this.quiz_id = parseInt(this.$route.params.quiz);
        getQuiz(this.quiz_id).then(r=> {
          this.quiz = r.data.data;
          this.quiz.quiz_date = (new Date(this.quiz.quiz_date)).toDateString();
          return getQuizTeams(this.quiz_id);
        }).then(r=>{
          this.teams = r.data.data.sort((a,b)=>a.team_id-b.team_id);
        })
      },
      add(){return createQuizTeam(this.quiz_id, this.newName).then(()=>this.update())},
      remove(id){return deleteTeam(id).then(()=>this.update())},
      modify(id){
        const r = this.rounds.find(r=>r.team_id===id);
        return modifyTeam(r.team_id,r).then(()=>this.update());

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
