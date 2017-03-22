<template>
  <div class="page">
    <div class="page-list">
    <table>
      <thead>
      <tr>
        <th colspan="3" width="50%">Round</th>
        <th>scored</th>
        <th>complete</th>
      </tr>
      </thead>
      <tr height="30px" class="rounds" v-for="(round, idx) in rounds" @click.prevent="selectRound(round.round_id)" :class="{selected:round.round_id===selected_round}">
        <td  colspan="3">{{round.round_title}}</td>
        <td>{{round.score_cnt}}</td>
        <td>{{!!round.complete}}</td>
      </tr>
      <tr>
        <td colspan="3">
          <button :class="{selected:showing_scores}" @click.prevent="showScores(selected_round)">Score Board</button>
        </td>
        <td colspan="2">
          <button :class="{selected:!showing_scores}" @click.prevent="showRounds(selected_round)">Round List</button>
        </td>
      </tr>
      <tr v-for="action of score_actions">
        <td colspan="5">
        <button @click.prevent="action.action">
          {{action.label}}
        </button>
        </td>
      </tr>
    </table>
    </div>
  </div>
</template>

<script>
  import {send, getQuiz, getQuizRounds, getQuizTeams, getQuizJokers, getQuizScores, putQuizScoreObj, dynamicSort, dynamicSortMulti} from '../qs-lib';
  export default {
    name: 'hello',
    data () {
      return {
        rounds:[],
        showing_scores:false,
        selected_round:null,
        scores:[],
        jokers:[],
        score_actions:[],
        quiz_id:null
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
      selectRound(r_id){
        console.log(r_id);
        this.selected_round=r_id;
      },
      showScores(r_id){
        send({go:`/display/quizzes/${this.quiz_id}/rounds/${r_id}/scores/`}).then(()=>this.update());
        this.showing_scores=true;
        //make a list of scores sorted by total without this round
        const teams={};
        this.scores.forEach(s=>{
          if (!teams[s.team_id]){
            teams[s.team_id]={total:0};
          }
          if (s.round_id===this.selected_round){
            teams[s.team_id].score=s;
          } else if (s.applied){
            if (this.teamJokers[s.team_id] && this.teamJokers[s.team_id].round_id == s.round_id){
              teams[s.team_id].total+=s.score*2;
            } else {
              teams[s.team_id].total+=s.score;
            }
          }
        });
        const teamList=Object.keys(teams).map(t=>teams[t]).sort((a,b)=>b.total-a.total);
        let i=0;
        const sa=[{label:"show all",action:()=>this.setScores(teamList)}];
        while(i<5 && i<teamList.length){
          while (i+1<teamList.length && teamList[i].total===teamList[i+1].total) i++;
          i++;
          sa.push((i=>({
            label: `show below place ${i}`,
            action: ()=>this.setScores(teamList.slice(i))
          }))(i));
        }
        sa.push({label:"clear",action:()=>this.clearScores(teamList)});
        this.score_actions=sa;
      },
      showRounds(r_id){
        send({go:`/display/quizzes/${this.quiz_id}/rounds/${r_id}/`}).then(()=>this.update());
        this.showing_scores=false;
        this.score_actions=[];
      },
      setScores(scores){
        Promise
            .all([scores.map(t=>t.score).map(s=> {
              if (!s.applied) {
                s.applied = true;
                return putQuizScoreObj(s);
              }
              return Promise.resolve();
            })])
            .then(()=>send({update: true}))
            .then(()=>this.update());
      },
      clearScores(scores){
        console.log('clear', scores);
        Promise
            .all([scores.map(t=>t.score).map(s=> {
              if (s.applied) {
                console.log(s);
                s.applied = false;
                return putQuizScoreObj(s);
              }
              return Promise.resolve();
            })])
            .then(()=>send({update: true}))
            .then(()=>this.update());
      },
      applyScores(r_id, pos){
        Promise
            .all([this.scores
                .filter(s=>s.round_id === r_id)
                .sort(dynamicSort(['score']))
                .slice(0, pos)
                .map(s=> {
                  if (!s.applied) {
                    s.applied = true;
                    return putQuizScoreObj(s);
                  }
                  return Promise.resolve();
                })
            ])
            .then(()=>send({update: true}))
            .then(()=>this.update());
      },
      update(){
        this.quiz_id = parseInt(this.$route.params.quiz);
        Promise.all([
          getQuiz(this.quiz_id),
          getQuizRounds(this.quiz_id),
          getQuizScores(this.quiz_id),
          getQuizJokers(this.quiz_id)
        ]).then(([
          {data:{data:quiz}},
          {data:{data:rounds}},
          {data:{data:scores}},
          {data:{data:jokers}}
        ])=> {

          quiz.quiz_date = (new Date(quiz.quiz_date)).toDateString();
          this.quiz = quiz;

          rounds = rounds.sort((a, b)=>a.round_order - b.round_order);
          let cnt = 0;
          const roundsi = rounds.reduce((i, r)=> {
            r.score_cnt=0;
            i[r.round_id] = r;
            return i
          }, {});

          scores.forEach(s=> {
            const r=roundsi[s.round_id];
            r.score_cnt++;
            if (typeof r.complete === "undefined" || r.complete)r.complete = s.applied;
          });

          this.rounds=rounds;
          this.scores=scores;
          this.teamJokers=jokers.reduce((tj,j)=>{
            tj[j.team_id]=j;
            return tj;
          },{});
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  table { border-collapse: collapse; }
  button{
    height:30px;
    font-size:16px;
    background: #aaddff;
    padding:2px 5px;
    margin:2px;
    width: 100%
  }
  button.selected{
    background: #88aadd;
  }
  tr{
    height:30px;
    border-bottom: 1px solid white;
  }
  tr.selected{
    background:white;
  }
  tr.rounds{
    border: 1px white solid;
  }
  col{
    width: 30px;
  }
  /*tr.rounds>td{*/
    /*pointer-events: none;*/
  /*}*/
</style>
