import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/session',
    name: 'session',
    component: () => import('@/views/Session.vue')
  },
  {
    path: '/friendsList',
    name: 'friendsList',
    component: () => import('@/views/FriendsList.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/Setting.vue')
  },
  {
    path: '/FriendDetail',
    name: 'FriendDetail',
    component: () => import('@/views/FriendDetail.vue')
  },
  {
    path: '/ChatDetail',
    name: 'ChatDetail',
    component: () => import('@/views/ChatDetail.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
