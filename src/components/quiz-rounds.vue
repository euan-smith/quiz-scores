<template>
  <div class="page">
    <h1 class="page-title">{{quiz_title}}</h1>
    <div class="page-list" :style="{fontSize:fontSize}">
      <div class="item-line" :class="{complete: round.complete}" v-for="round of rounds" :style="{top:round.top}">
        {{round.round_title}}
      </div>
    </div>
  </div>
</template>

<script>
  import {setListener, getQuiz, getQuizRounds} from '../qs-lib'

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
        rounds: []
      }
    },
    methods: {
      update(){
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

          rounds = rounds.sort((a, b)=>a.round_order - b.round_order);
          let prev = true;
          let cnt = 0;
          const roundsi = rounds.reduce((i, r)=> {
            if (r.round_id === this.round_id) prev = false;
            r.complete = prev;
            r.top = (100*cnt++ / rounds.length).toFixed(1) + "%";
            i[r.round_id] = r;
            return i
          }, {});

          this.quiz_title = quiz.quiz_title;
          this.rounds = rounds;
        });
      }
    },
    computed: {
      fontSize(){
        return (50 / this.rounds.length).toFixed(1) + "vh";
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    background: white;
  }

  .rounds {
    width: 100%;
    height: 100%
  }

  .round-list {
    position: relative;
  }

  .item-line.complete {
    color: #aaa;
    text-decoration: line-through;
    box-shadow: -1px 1px 9px 1px rgba(0, 0, 0, 0.1);
  }
</style>
