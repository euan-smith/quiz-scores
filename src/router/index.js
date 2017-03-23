import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Quizzes from '@/components/Quizzes'
import Rounds from '@/components/Rounds'
import Teams from '@/components/Teams'
import Scores from '@/components/Scores'
import ScoreBoard from '@/components/score-board'
import QuizRounds from '@/components/quiz-rounds'
import Remote from '@/components/Remote'
import ShowTeam from '@/components/ShowTeam'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/quizzes'
    },{
      path: '/test',
      name: 'Hello',
      component: Hello
    },{
      path: '/display/quizzes/:quiz/rounds/:round/scores',
      name: 'Score Board',
      component: ScoreBoard
    },{
      path: '/display/quizzes/:quiz/rounds/:round',
      name: 'Quiz Round',
      component: QuizRounds
    },{
      path: '/display/quizzes/:quiz/teams/:team',
      name: 'Show Team',
      component: ShowTeam
    },{
      path: '/quizzes',
      name: 'Quizzes',
      component: Quizzes
    },{
      path: '/quizzes/:quiz/rounds',
      name: 'Rounds',
      component: Rounds
    },{
      path: '/quizzes/:quiz/teams',
      name: 'Teams',
      component: Teams
    },{
      path: '/quizzes/:quiz/scores',
      name: 'Scores',
      component: Scores
    },{
      path: '/quizzes/:quiz/rounds/:round/scores',
      name: 'Round Scores',
      component: Scores
    },{
      path: '/quizzes/:quiz/remote',
      name: 'Remote',
      component: Remote
    }
  ]
})

/*
 /quizzes/:quiz/rounds/:round
 */