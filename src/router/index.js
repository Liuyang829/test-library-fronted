import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/view/login')
    },
    {
      path:'/Question',
      name:'question',
      component:() =>import('@/view/question')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/view/register')
    },
    {
      path: '/AutoPaper',
      name: 'AutoPaper',
      component: () => import('@/view/AutoPaper')
    },
    // AutoPaper
    {
      path: '/AutoPaper',
      name: 'AutoPaper',
      component: () => import('@/view/AutoPaper')
    },
    {
      path: '/ManualPaper',
      name: 'ManualPaper',
      component: () => import('@/view/ManualPaper')
    },
    {
      path: '/Enter',
      name: 'Enter',
      component: () => import('@/view/Enter')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/view/home')
    },
    {
      path: '/addquestion',
      name: 'addquestion',
      component: () => import('@/view/addquestion')
    },
    {
      path: '/testueditor',
      name: 'testueditor',
      component: () => import('@/view/testueditor')
    },
    {
      path:'/paperdetail',
      name:'paperdetail',
      component:()=>import('@/view/paperdetail')
    }
  ]
})
