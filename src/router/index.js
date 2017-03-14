import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Quizzes from '@/components/Quizzes'
import Rounds from '@/components/Rounds'
import Teams from '@/components/Teams'
import Scores from '@/components/Scores'
import ScoreBoard from '@/components/score-board'
import QuizRounds from '@/components/quiz-rounds'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/test',
      name: 'Hello',
      component: Hello
    },{
      path: '/quizzes/:quiz/rounds/:round',
      name: 'Score Board',
      component: ScoreBoard
    },{
      path: '/quizzes/:quiz/rounds',
      name: 'Quiz Round',
      component: QuizRounds
    },{
      path: '/quizzes',
      name: 'Quizzes',
      component: Quizzes
    },{
      path: '/rounds',
      name: 'Rounds',
      component: Rounds
    },{
      path: '/teams',
      name: 'Teams',
      component: Teams
    },{
      path: '/scores',
      name: 'Scores',
      component: Scores
    }
  ]
})

/*
 /quizzes/:quiz/rounds/:round
 */