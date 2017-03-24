<template>
  <div class="page">
    <div class="page-list">
    <table>
      <tr>
        <th></th>
        <th class="rotate" v-for="round in roundList">
          <div><span>{{round.round_title}}</span></div>
        </th>
        <th class="rotate">
          <div><span>{{roundsi[round_id]&&roundsi[round_id].round_title}}</span></div>
        </th>
        <th></th>
        <th  class="rotate"><div><span>TOTAL</span></div></th>
      </tr>
      <tr v-for="(team, idx) in teams">
        <th class="left"><div>{{team.team_name}}</div></th>
        <td v-for="round in roundList"><div class="score" :class="{joker: round.round_id===team.joker_round}">{{team.scores[round.round_id].score}}</div></td>
        <td><input class="score" :class="{joker: round_id===team.joker_round}" v-model="team.score.score" @blur.prevent="set(round_id,team.team_id)" :tabindex="idx+10"></td>
        <td>
          <button class="joker" v-if="typeof team.joker_round === 'undefined'" @click.prevent="setJoker(round_id, team.team_id)" :tabindex="idx+100">Play Joker</button>
          <button class="no-joker" v-if="round_id === team.joker_round"  @click.prevent="clearJoker(team.team_id)" :tabindex="idx+100">Clear Joker</button>
        </td>
        <td class="total">{{team.total}}</td>
      </tr>

    </table>
    </div>
    <div class="page-footer">
      <router-link class="nav" :class="{hidden: round_cnt<=0}" :to="{name:'Round Scores', params:{quiz:quiz_id, round:round_cnt}}">previous</router-link>
      <router-link class="nav" :class="{hidden: round_cnt>=rounds.length-1}" :to="{name:'Round Scores', params:{quiz:quiz_id, round:round_cnt+2}}">next</router-link>
      <router-link class="nav" :to="{name:'Rounds', params:{quiz:quiz_id}}">rounds</router-link>
      <router-link class="nav" :to="{name:'Teams', params:{quiz:quiz_id}}">teams</router-link>
    </div>
  </div>
</template>

<script type="text/babel">
  import {roundSorter, getQuiz, getQuizRounds, getQuizTeams, getQuizJokers, getQuizScores, deleteQuizJoker, deleteQuizScore, putQuizJoker, putQuizScore} from '../qs-lib';
  export default {
    name: 'hello',
    data () {
      return {
        round_cnt:0,
        round_id:-1,
        quiz_id: -1,
        round_order: -1,
        quiz: {},
        rounds: [],
        teams: [],
        scores: [],
        roundsi:{},
        teamsi:{},
        roundScores:[]
      }
    },
    created(){
      this.update();
    },
    watch:{
      "$route"(){
        this.update();
      }
    },
    methods: {
      update(){
	  	document.head.querySelector('title').innerHTML="Scores";
        this.quiz_id = parseInt(this.$route.params.quiz);
        Promise.all([
          getQuiz(this.quiz_id),
          getQuizRounds(this.quiz_id),
          getQuizTeams(this.quiz_id),
          getQuizScores(this.quiz_id),
          getQuizJokers(this.quiz_id)
        ]).then(([
          {data:{data:quiz}},
          {data:{data:rounds}},
          {data:{data:teams}},
          {data:{data:scores}},
          {data:{data:jokers}}
        ])=> {
          rounds = rounds.sort(roundSorter);
          if (this.$route.params.round) {
            this.round_cnt = parseInt(this.$route.params.round)-1;
            if (this.round_cnt<0)this.round_cnt=0;
            this.round_id = rounds[this.round_cnt]&&rounds[this.round_cnt].round_id;
            console.log(this.round_cnt, this.round_id);
          }

          quiz.quiz_date = (new Date(quiz.quiz_date)).toDateString();
          this.quiz = quiz;

          let cnt = 0;
          const roundsi = rounds.reduce((i, r)=> {
            i[r.round_id] = r;
            i.idx = cnt++;
            return i
          }, {});
//          if (this.round_cnt < 0)this.round_cnt = 0;
//          if (this.round_cnt >= this.rounds.length)this.round_cnt = this.rounds.length - 1;

          teams = teams.sort((a, b)=>a.team_id - b.team_id).map(t=> {
            t.scores = {};
            t.total=0;
            return t
          });
          const teamsi = teams.reduce((i, r)=> {
            i[r.team_id] = r;
            return i
          }, {});

          jokers.forEach(j=>{
            teamsi[j.team_id].joker_round=j.round_id;
          });

          scores.forEach(s=> {
            const t=teamsi[s.team_id];
            t.scores[s.round_id] = s;
            t.total+=s.score*(t.joker_round===s.round_id?2:1);
          });

          teams.forEach(t=> {
            rounds.forEach(r=> {
              if (typeof t.scores[r.round_id] === "undefined") {
                t.scores[r.round_id] = {round_id: r.round_id, quiz_id: this.quiz_id, team_id: t.team_id, score: ""}
              }
            });

            t.score = t.scores[this.round_id];
          });

          this.teams=teams;
          this.teamsi=teamsi;
          this.rounds=rounds;
          this.roundsi=roundsi;
          this.scores = scores;
        });
      },
      set(round_id, team_id){
        const score = parseInt(this.teamsi[team_id].score.score);
        if (isNaN(score))return deleteQuizScore(this.quiz_id,round_id,team_id).then(()=>this.update());
        return putQuizScore(this.quiz_id,round_id,team_id,parseInt(score)).then(()=>this.update());
      },
      setJoker(round_id, team_id){
        return putQuizJoker(this.quiz_id, round_id, team_id).then(()=>this.update());
      },
      clearJoker(team_id){
        return deleteQuizJoker(this.quiz_id, team_id).then(()=>this.update());
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
    height: 100px;
    white-space: nowrap;
  }

  th.rotate > div {
    transform: translate(23px, 33px) rotate(315deg);
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

  .score{
    position:relative;
    background: white;
    padding:2px;
    margin: 2px;
    border:1px solid white;
    box-shadow: 0 0 1px 1px rgba(0,0,0,0.2);
    width: 30px;
    height: 18px;
    font-size: 16px;
  }
  div.score{
    background: #f0f0f0;
  }
  div.joker, input.joker{
    border:1px solid red;
  }
  button.joker{
    height: 18px;
    width: 80px;
    background: #fdd;
  }
  button.no-joker{
    height: 18px;
    width: 80px;
    background: #dfd;
  }

  .total{
    padding-left:1em;
    font-weight: bold;
  }
  div.page-list{
    overflow:auto;
  }
  .page-footer{
    padding: 10px;
    height:25px;
    position:fixed;
    bottom:1em;
    left:50%;
	width:100%;
    transform:translate(-50%,0);
  }
  .nav{
    font-size:20px;
    font-weight:bold;
    padding:5px 10px;
    margin:8px;
    background:#223366;
    color:white;
    box-shadow: -2px 3px 18px 2px rgba(0,0,0,0.2);
  }
  .hidden{
    opacity:0;
    pointer-events: none;
  }
</style>
