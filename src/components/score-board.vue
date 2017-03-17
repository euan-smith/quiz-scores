<template>
  <div class="page">
    <h1 class="page-title">{{round_title}}</h1>
    <div class="page-list" :style="{fontSize:fontSize}">
      <div v-for="team in teamList" class="item-line" :style="{top:team.top, zIndex: team.animating?999:0, maxWidth:maxLineWidth}">
        <span class="team-name">{{team.name}}</span>
        <span class="round-score" v-show="team.displayed">+{{team.score}}</span>
        <span class="total-score">{{team.total}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {setListener, getQuiz, getQuizRounds, getQuizTeams, getQuizJokers, getQuizScores} from '../qs-lib'

  let cnt = 0;
  export default {
    mounted(){
      //register for messages
      setListener(m=>{
        if (m.go) this.$router.push(m.go);
        if (m.update){
          this.update();
        }
      });
    },
    beforeDestroy(){
      //deregister
      setListener(null);
    },
    name: 'score-board',
    data () {
      this.update();
      return {
        round_title: "",
        //team_id: n, team_name: s, joker_state: s?, joker, round_score, total_score, applied: b
        teams: [],
        calling: false
      };
    },
    watch:{
      "$route"(){
        this.update();
      }
    },
    methods:{
      update(){
        if (this.calling) return;
        this.calling=true;
        this.quiz_id = parseInt(this.$route.params.quiz);
        this.round_id = parseInt(this.$route.params.round);
        Promise.all([
          getQuizRounds(this.quiz_id),
          getQuizTeams(this.quiz_id),
          getQuizScores(this.quiz_id),
          getQuizJokers(this.quiz_id)
        ]).then(([
          {data:{data:rounds}},
          {data:{data:teams}},
          {data:{data:scores}},
          {data:{data:jokers}}
        ])=> {
          const round= rounds.find(r=>r.round_id===this.round_id);
          this.round_title = round.round_title;

          const teamsi={};
          teams=teams.map(t=>{t.total_score=0; t.joker_state="held"; teamsi[t.team_id]=t; return t}).sort((a,b)=>a.team_id=b.team_id);

          jokers.forEach(j=>{
            const t=teamsi[j.team_id];
            t.joker=j;
          });

          scores.forEach(s=>{
            if (s.applied){
              const t=teamsi[j.team_id];
              if (t.joker && t.joker.round_id===s.round_id){
                t.total_score+=s.score*2;
                t.joker_state="taken";
              }
              else t.total_score+=s.score;
              if (s.round_id === round.round_id) t.round_score=s.score;
            }
          });

          teams.filter(t=>t.joker && t.joker.round_id===round.round_id).forEach(t=>{t.joker_state="played"});

          this.teams=teams;
          this.calling=false;
        });
      }
    },
    computed: {
      teamList(){
        const scoreOrder = this.teams.sort((a, b)=>a.total_score - b.total_score);
        return this.teams.map(t=> {
          const idx = scoreOrder.indexOf(t);
          return {
            name: t.team_name,
            joker: t.joker_status,
            score: t.round_score,
            displayed: t.applied,
            total: t.total_score,
            top: 100 * idx / this.teams.length + "%",
          }
        })
      },
      fontSize(){
        return (50 / this.teams.length).toFixed(1) + "vh";
      },
      maxLineWidth(){
        return (2500 / this.teams.length).toFixed(1) + "vh";
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-title{
    font-size: 48px;
  }

  .item-line {
    display: flex;
    flex-direction: row;
    transition: top 0.5s 0.25s;
    padding:2px 0 2px 1em;
  }

  .team-name {
    text-align: left;
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .round-score {
    flex: 0 0 3em;
  }

  .total-score {
    flex: 0 0 3em;
  }

</style>
