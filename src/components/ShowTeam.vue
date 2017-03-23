<template>
  <div class="page">
    <h1 class="name" :class="{blur}">{{team}}</h1>
    <h1 class="countdown" v-if="count>=0">{{count===0?"OUT OF TIME!":count}}</h1>
  </div>
</template>

<script>
  import {setListener, getQuiz, getQuizRounds, getTeam, getQuizJokers, getQuizScores,dynamicSort, dynamicSortMulti} from '../qs-lib'
  export default {
    mounted(){
      //register for messages
      setListener(m=>{
        console.log(m);

        if (m.go) this.$router.push(m.go);
        if (m.update){
          this.update();
        }
        if (m.countdown){
          this.setTimer(m.countdown);
        }
      });
    },
    beforeDestroy(){
      //deregister
      setListener(null);
    },
    name: 'show-team',
    data () {
      this.update();
      return {
        team:"",
        calling: false,
        team_id:-1,
        quiz_id:-1,
        count:-1,
        timer:null,
        blur:false
      };
    },
    watch:{
      "$route"(){
        this.blur = true;
        setTimeout(()=>{
          this.update();
          setTimeout(()=>{
            this.blur=false;
          },500)
        },500);
      }
    },
    methods:{
      blur(){
        this.blur = true;
      },
      unBlur(){

      },
      setTimer(count){
        this.clearTimer();
        this.count=count;
        this.timer = setInterval(()=>{
          this.count--;
          if (this.count<=0) this.clearTimer();
        },1000)
      },
      clearTimer(){
        if (this.timer) clearInterval(this.timer);
        this.timer=null;
      },
      update(){
        if (this.calling) return;
        this.calling=true;
        this.quiz_id = parseInt(this.$route.params.quiz);
        this.team_id = parseInt(this.$route.params.team);

        Promise.all([
          getTeam(this.team_id)
        ]).then(([
          {data:{data:team}}
        ])=> {
          this.team=team?team.team_name:"no selection";
          this.calling=false;
          this.count=-1;
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
  h1{
    position:absolute;
    top:30%;
    left:50%;
    font-size:15vh;
    transform: translate(-50%,-50%);
  }
  h1.name{
    color: transparent;
    text-shadow: 0 0 0px #000;
    transition: text-shadow 1s;
  }
  h1.name.blur{
    color: transparent;
    text-shadow: 0 0 100px transparent;
  }
  h1.countdown{
    top:60%;
    font-size: 20vh;
    width:100%;
  }

</style>
