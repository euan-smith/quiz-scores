<template>
  <div class="page">
    <h1 class="page-title">{{round_title}}</h1>
    <div class="page-list" :style="{fontSize:fontSize}">
      <div v-for="team in teams" :key="team.team_id" class="item-line" :style="{top:team.top,zIndex:team.zIndex, width:lineWidth, left:team.left}">
        <span class="position">{{team.pos}}</span>
        <span class="team-name" :class="{joker: team.joker_state==='held'}">{{team.team_name}}</span>
        <span class="round-score" :class="{joker: team.joker_state==='played'}"><span v-show="team.applied">+{{team.round_score}}</span></span>
        <span class="total-score">{{team.total_score}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {setListener, getQuiz, getQuizRounds, getQuizTeams, getQuizJokers, getQuizScores,dynamicSort, dynamicSortMulti} from '../qs-lib'
  import ord from 'ord';
  let cnt = 0;
  export default {
    mounted(){
      //register for messages
      setListener(m=>{
        console.log(m);

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
        calling: false,
        columns:1,
        lineWidth:90,
        fontSize: "5vh"
      };
    },
    watch:{
      "$route"(){
        this.update();
      }
    },
    methods:{
      update(){
	  	document.head.querySelector('title').innerHTML="Display Scoreboard";
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
          teams.forEach(t=>{t.total_score=0; t.joker_state="held"; teamsi[t.team_id]=t});
          teams.sort((a,b)=>a.team_id=b.team_id);

          jokers.forEach(j=>{
            const t=teamsi[j.team_id];
            t.joker=j;
          });

          scores.forEach(s=>{
            if (s.applied){
              const t=teamsi[s.team_id];
              if (t.joker && t.joker.round_id===s.round_id){
                t.total_score+=s.score*2;
                t.joker_state="taken";
              }
              else t.total_score+=s.score;
              if (s.round_id === this.round_id) {
                t.round_score=s.score;
                t.applied = s.applied;
              }
            }
          });
          teams=teams.slice(0);
          const columns=Math.floor(Math.sqrt(teams.length)/3+1);
          const colCount=Math.ceil(teams.length/columns);
          const maxLineWidth=90/columns;

          teams.filter(t=>t.joker && t.joker.round_id===this.round_id).forEach(t=>{t.joker_state="played"});
          let cnt=0;
          teams.slice().sort(dynamicSortMulti(['-total_score','team_name'])).forEach(t=>{
            t.top=(100 * ((cnt % colCount)*2+Math.floor(cnt/colCount)) / (teams.length+columns-1)).toFixed(1) + "%";
            t.left=((Math.floor(cnt/colCount)*100+5)/columns).toFixed(1)+"%";
            t.zIndex=100-cnt++;
            t.pos=cnt+ord(cnt);
          });
          //max: 9vh for 1 col, 6vh for 2 col
          this.fontSize=Math.min(15/(columns+1),45 * columns / (teams.length)).toFixed(1) + "vh";


          this.columns=columns.toFixed(1);
          this.lineWidth=maxLineWidth.toFixed(1)+"%";
          this.teams=teams;
          this.calling=false;
        });
      }
    },
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
    transition: top 0.75s 0.5s, left 0.75s 0.5s;
    padding:5px 0 5px 0.2em;
  }
  .position{
    margin:0;
    padding:0;
    width: 2.5em;
  }
  .team-name {
    padding: 0 0 0 0.5em;
    text-align: left;
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .joker::after{
    display:inline-block;
    position:relative;
    top:-0.25em;
    left:0.25em;
    content: "";
    width:0.75em;
    height: 0.8em;
    background-image: url(joker.png);
    background-size: 0.75em auto;
  }
  .round-score.joker::after{
    color: rgba(0,0,0,0);
    content: "O";
    text-shadow: 0 0 18px yellow;
  }

  .round-score {
    flex: 0 0 3em;
  }

  .total-score {
    flex: 0 0 3em;
  }

</style>
