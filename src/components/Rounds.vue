<template>
  <div class="page">
    <h2 class="page-title">Rounds for {{quiz.quiz_title}} on {{quiz.quiz_date}}</h2>
    <div class="page-list">
      <table>
        <tr>
          <th>id</th>
          <th>order</th>
          <th>title</th>
          <th>joker ok?</th>
          <th></th>
        </tr>
        <tr v-for="round of rounds">
          <td><input v-model="round.round_id" style="width: 3em" disabled></td>
          <td><input v-model="round.round_order" @blur.prevent="modify(round.round_id)"></td>
          <td><input v-model="round.round_title" @blur.prevent="modify(round.round_id)"></td>
          <td><input v-model="round.can_play_joker" type="checkbox" @keyup.enter.prevent="modify(round.round_id)"></td>
          <td><button @click.prevent="remove(round.round_id)">Delete</button></td>
        </tr>
        <tr class="add-row">
          <td></td>
          <td><input v-model="newOrder" @keyup.enter.prevent="add"></td>
          <td><input v-model="newTitle" @keyup.enter.prevent="add"></td>
          <td><input v-model="canPlayJoker" type="checkbox" @keyup.enter.prevent="add"></td>
          <td><button @click.prevent="add">Add</button></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import {getQuiz, getQuizRounds, createQuizRound, modifyRound, deleteRound} from '../qs-lib';
  export default {
    name: 'hello',
    data () {
      return {
        newTitle:"round title",
        newOrder:0,
        canPlayJoker:true,
        newDate:(new Date()).toDateString(),
        quiz_id:-1,
        quiz:{},
        rounds:[]
      };
    },
    created(){
      this.update();
    },
    methods:{
      update(){
        this.quiz_id = parseInt(this.$route.params.quiz);
        getQuiz(this.quiz_id).then(r=> {
          this.quiz = r.data.data;
          this.quiz.quiz_date = (new Date(this.quiz.quiz_date)).toDateString();
          return getQuizRounds(this.quiz_id);
        }).then(r=>{
          this.rounds = r.data.data.sort((a,b)=>a.round_id-b.round_id);
        })
      },
      add(){return createQuizRound(this.quiz_id, this.newOrder, this.newTitle, this.canPlayJoker).then(()=>this.update())},
      remove(id){return deleteRound(id).then(()=>this.update())},
      modify(id){
        const r = this.rounds.find(r=>r.round_id===id);
        return modifyRound(r.round_id,r).then(()=>this.update());

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
