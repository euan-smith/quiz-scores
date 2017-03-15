<template>
  <div class="page">
    <table class="page-list">
      <tr>
        <th></th>
        <th class="rotate" v-for="round in roundList">
          <div><span>{{round.round_title}}</span></div>
        </th>
      </tr>
      <tr v-for="team in teams">
        <th class="left"><span>{{team.team_name}}</span></th>
        <td v-for="round in roundList"><input></td>
      </tr>
    </table>
    <div class="page-footer"><router-link :to="{name:'Round Scores', params:{quiz:quiz_id, round:round_cnt-1}}">previous</router-link>
      <router-link :to="{name:'Round Scores', params:{quiz:quiz_id, round:round_cnt+1}}">next</router-link></div>
  </div>
</template>

<script>
  import {getQuiz, getQuizRounds, getQuizTeams, getQuizJokers, getQuizScores, deleteQuizJoker, deleteQuizScore, putQuizJoker, putQuizScores} from '../qs-lib';
  export default {
    name: 'hello',
    data () {
      return {
        quiz_id: -1,
        round_order: -1,
        quiz: {},
        rounds: [],
        teams: [],
        scores: []
      }
    },
    created(){
      this.update();
    },
    watch:{
      "$route"(from,to){
        this.update();
      }
    },
    methods: {
      update(){
        this.quiz_id = parseInt(this.$route.params.quiz);
        if (this.$route.params.round){
          this.round_cnt = parseInt(this.$route.params.round);
        }
        getQuiz(this.quiz_id).then(r=> {
          this.quiz = r.data.data;
          this.quiz.quiz_date = (new Date(this.quiz.quiz_date)).toDateString();
          return getQuizRounds(this.quiz_id);
        }).then(r=> {
          this.rounds = r.data.data.sort((a, b)=>a.round_order - b.round_order);
          return getQuizTeams(this.quiz_id);
        }).then(r=> {
          this.teams = r.data.data.sort((a, b)=>a.team_id - b.team_id);
        }).then(r=>{

        })
      },
      add(){
        return createQuizRound(this.quiz_id, this.newOrder, this.newTitle, this.canPlayJoker).then(()=>this.update())
      },
      remove(id){
        return deleteRound(id).then(()=>this.update())
      },
      modify(id){
        const r = this.rounds.find(r=>r.round_id === id);
        return modifyRound(r.round_id, r).then(()=>this.update());
      }
    },
    computed:{
      roundList(){
        if (this.round_cnt===-1) return this.rounds;
        return this.rounds.slice(0,this.round_cnt);
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  th.rotate {
    /* Something you can count on */
    height: 140px;
    white-space: nowrap;
  }

  th.rotate > div {
    transform: translate(25px, 51px) rotate(315deg);
    width: 30px;
  }

  th.rotate > div > span {
    border-bottom: 1px solid #ccc;
    padding: 5px 10px;
  }

  th.left > span {
    padding-right: 0.5em;
  }

  th.left {
    text-align: right;
    border-bottom: 1px solid #ccc;
    white-space: nowrap;
  }

  td > input {
    width: 3em;
  }
</style>
