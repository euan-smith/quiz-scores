<template>
  <div class="page">
    <div class="page-list">
    <table>
      <tr>
        <th>Round</th>
        <th>scored</th>
        <th>complete</th>
        <th></th>
        <th></th>
      </tr>
      <tr v-for="(round, idx) in rounds">
        <td>{{round.round_title}}</td>
        <td>{{round.score_cnt}}</td>
        <td>{{!!round.complete}}</td>
        <td><button @click.prevent="showScores(round.round_id)">SHOW SCORES</button></td>
        <td><button @click.prevent="showRounds(round.round_id)">SHOW ROUNDS</button></td>
      </tr>
      <tr>
        <td colspan="5">
          <button :disabled="!showing_scores" @click.prevent="applyScores(score_round,-5)">show 6th+</button>
          <button :disabled="!showing_scores" @click.prevent="applyScores(score_round,-4)">show 5th+</button>
          <button :disabled="!showing_scores" @click.prevent="applyScores(score_round,-3)">show 4th+</button>
          <button :disabled="!showing_scores" @click.prevent="applyScores(score_round,-2)">show 3th+</button>
          <button :disabled="!showing_scores" @click.prevent="applyScores(score_round,-1)">show 2th+</button>
          <button :disabled="!showing_scores" @click.prevent="applyScores(score_round,scores.length)">show all</button>
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
        score_round:0,
        scores:[],
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
      showScores(r_id){
        send({go:`/display/quizzes/${this.quiz_id}/rounds/${r_id}/scores/`}).then(()=>this.update());
        this.score_round=r_id;
        this.showing_scores=true;
      },
      showRounds(r_id){
        send({go:`/display/quizzes/${this.quiz_id}/rounds/${r_id}/`}).then(()=>this.update());
        this.showing_scores=false;
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
          getQuizScores(this.quiz_id)
        ]).then(([
          {data:{data:quiz}},
          {data:{data:rounds}},
          {data:{data:scores}}
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
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  button{
    font-size:16px;
    background: #aaddff;
    padding:2px;
    margin:2px;
  }
</style>
