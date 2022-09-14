import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/components/Login.vue'
import Session from '@/components/Session.vue'
import FriendsList from '@/components/FriendsList.vue'
import Setting from '@/components/Setting.vue'
import FriendDetail from '@/components/FriendDetail'
import ChatDetail from '@/components/ChatDetail'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   redirect:'/login'
  // },
  {
    path: '/',
    name: 'login',
    // component: Login
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/session',
    name: 'session',
    component: Session
  },
  {
    path: '/friendsList',
    name: 'friendsList',
    component: FriendsList
  },
  {
    path: '/setting',
    name: 'setting',
    component: Setting
  },
  {
    path: '/friendDetail',
    name: 'friendDetail',
    component: FriendDetail
  },
  {
    path: '/chatDetail',
    name: 'chatDetail',
    component: ChatDetail
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
