<template>
  <div class="page">
    <h1 class="page-title">{{round_title}}</h1>
    <div class="page-list" :style="{fontSize:fontSize}">
      <div v-for="team in teamList" class="item-line" :style="{top:team.top, zIndex: team.animating?999:0}">
        <span class="team-name">{{team.name}}</span>
        <span class="round-score" v-show="team.displayed">+{{team.score}}</span>
        <span class="total-score">{{team.total}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  let cnt=0;
  let tick=true;
  setInterval(()=>tick=!tick, 2000);
export default {
  name: 'score-board',
  data () {
    const rtn= {
      round_title: "Albums",
      teams:[
        {team_id:cnt++, team_name:"The Korfballers", joker:"Held", round_score: 7, total_score:25, displayed: false},
        {team_id:cnt++, team_name:"The Bee Keepers", joker:"Held", round_score: 5, total_score:25, displayed: false},
        {team_id:cnt++, team_name:"Quizzicals", joker:"Played", round_score: 8, total_score:24, displayed: false},
        {team_id:cnt++, team_name:"The Oscar Men", joker:"Used", round_score: 6, total_score:17, displayed: false},
        {team_id:cnt++, team_name:"One Short of a Quiz Team", joker:"Held", round_score: 8, total_score:30, displayed: false},
        {team_id:cnt++, team_name:"The No-Hopers", joker:"Held", round_score: 6, total_score:22, displayed: false},
        {team_id:cnt++, team_name:"The Jackson 5", joker:"Held", round_score: 7, total_score:23, displayed: false},
        {team_id:cnt++, team_name:"The Clueless", joker:"Held", round_score: 5, total_score:20, displayed: false},
        {team_id:cnt++, team_name:"The Interlopers", joker:"Played", round_score: 8, total_score:19, displayed: false},
      ]
    };
    const order = rtn.teams.slice().sort((a,b)=>a.total_score>b.total_score).map(t=>t.team_id);
    let i=0;
    setInterval(()=>{
      if (i===order.length){
        i=0;
        rtn.teams.forEach(t=>t.displayed=false);
      } else {
        do {
          (tm=>{
            tm.displayed=true;
            tm.animating=true;
            setTimeout(()=>{
              tm.animating=false;
            }, 1000);
          })(rtn.teams[order[i]]);
          i++;
        } while (i+5<order.length)
      }
    },2000);
    return rtn;
  },
  computed:{
    teamList(){
      const scores = this.teams.map(t=>[t.team_id, t.total_score+(t.displayed?t.round_score:0)]).sort((a,b)=>a[1]<b[1]);
      return this.teams.map(t=>{
        const idx = scores.findIndex(s=>s[0]===t.team_id);
        return {
          name:t.team_name,
          joker:t.joker,
          score:t.round_score,
          displayed:t.displayed,
          total: scores[idx][1],
          top:100*idx/scores.length+"%",
          animating: t.animating
      }})
    },
    fontSize(){
      return (50/this.teams.length).toFixed(1)+"vh";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .item-line{
    display:flex;
    flex-direction: row;
    transition: top 0.5s 0.25s;
  }
  .team-name{
    text-align: left;
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .round-score{
    flex: 0 0 3em;
  }
  .total-score{
    flex: 0 0 3em;
  }

</style>
