<template>
  <div class="page">
    <h1 class="page-title">{{quiz_title}}</h1>
    <div class="page-list" :style="{fontSize:fontSize}">
      <div class="item-line" :class="{complete: round.complete}" v-for="round of roundList" :style="{top:round.top}">
        {{round.title}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rounds',
  data () {
    const rounds=['Albums','Next Lines','EU','Cars','Science','What Did the Romans Do For Us?','Family','Can`t think of a round name'];
    let ord=0;
    return {
      quiz_title: "The Hatton Park Quiz",
      rounds:rounds.map(r=>({round_title:r,order: ord++, complete: ord<4}))
    }
  },
  computed:{
    roundList(){
      let cnt=0;
      return this.rounds.slice().sort((a,b)=>a.order>b.order).map(r=>({
        title: r.round_title,
        top: ((cnt++)/this.rounds.length*100).toFixed(1)+"%",
        complete: r.complete
      }))
    },
    fontSize(){
      return (50/this.rounds.length).toFixed(1)+"vh";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page{
    background: white;
  }
  .rounds{
    width:100%;
    height:100%
  }
  .round-list{
    position: relative;
  }
  .item-line.complete{
    color: #aaa;
    text-decoration: line-through;
    box-shadow: -1px 1px 9px 1px rgba(0,0,0,0.1);
  }
</style>
