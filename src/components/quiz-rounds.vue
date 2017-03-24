<template>
  <div class="page">
    <h1 class="page-title">{{quiz_title}}</h1>
    <div class="round-list non-seq">
      <div class="round-item" :class="{current: round.round_id===round_id && showCurrent}" v-for="round of nonSeqRounds">
        <div class="title">{{round.round_title}}</div>
        <div class="joker" v-show="round.can_play_joker"></div>
      </div>
    </div>
    <div class="round-list">
      <div class="round-item" :class="{current: round.round_id===round_id && showCurrent}" v-for="(round,i) of rounds">
        <div class="index">{{i+1}}</div>
        <div class="title">{{round.round_title}}</div>
        <div class="joker" v-show="round.can_play_joker"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import {setListener, getQuiz, getQuizRounds, dynamicSort} from '../qs-lib'

  export default {
    name: 'rounds',
    mounted(){
      //register for messages
      setListener(m=> {
        console.log(m);
        if (m.go) this.$router.push(m.go);
        if (m.update) {
          this.update();
        }
      });
    },
    watch: {
      "$route"(){
        this.update();
      }
    },

    beforeDestroy(){
      //deregister
      setListener(null);
    },
    data () {
      this.update();
      return {
        quiz_title: "",
        rounds: [],
        nonSeqRounds:[],
        round_id:-1,
        quiz_id:-1,
        showCurrent:false
      }
    },
    methods: {
      update(){
	  	document.head.querySelector('title').innerHTML="Display Quiz Rounds";
        this.quiz_id = parseInt(this.$route.params.quiz);
        this.round_id = parseInt(this.$route.params.round);
        Promise.all([
          getQuiz(this.quiz_id),
          getQuizRounds(this.quiz_id)
        ]).then(([
          {data:{data:quiz}},
          {data:{data:rounds}}
        ])=> {
          quiz.quiz_date = (new Date(quiz.quiz_date)).toDateString();

          rounds = rounds.sort(dynamicSort("round_order"));

          this.quiz_title = quiz.quiz_title;
          this.rounds = rounds.filter(r=>r.sequential);
          this.nonSeqRounds = rounds.filter(r=>!r.sequential);
          this.showCurrent=false;
          setTimeout(()=>this.showCurrent=true,500);
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    background: #e0e0e0;
  }

  .title{
    position:absolute;
    font-size:4vh;
    width:100%;
    margin:0;
    top:60%;
    left:0;
    text-align: center;
    transform: translate(0,-50%);
  }
  .non-seq .title{
    top:50%;
  }

  .index{
    font-size:5vh;
    color:#444;
    top:0;
    left:0;
    width: 10vh;
    padding:1vh;
    text-align: left;
  }

  .joker{
    position:absolute;
    width:5vh;
    height:8vh;
    background-image: url(joker.png);
    background-size: 5vh auto;
    top:0;
    right:0;
  }

  .round-item{
    position:relative;
    color: rgba(0,0,0,0.6);
    background: #f0f0f8;
    color:black;
    width: 20vw;
    margin: 2vw;
    height: 20vh;
    /*border:1px solid black;*/
    box-shadow: -2px 3px 18px 2px rgba(0,0,0,0.25);
    transition: box-shadow 1s, background 1s;
  }
  .round-item.current{
    color: black;
    background: #ffffff;
    box-shadow: -4px 6px 36px 4px rgba(0,0,0,0.5);
  }
  .round-list {
    position: relative;
    display:flex;
    flex-direction: row;
    flex-flow: wrap;
    justify-content: center;
  }

</style>
