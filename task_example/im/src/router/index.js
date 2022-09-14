import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: {
      name: 'LoginView'
    }
  },

  {
    path: '/login',
    name: 'LoginView',
    component: () => import('../views/LoginView.vue')
  },

  {
    path: '/home',
    name: 'HomeView',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/contact',
    name: 'ContactView',
    component: () => import('../views/ContactView.vue')
  },
  {
    path: '/setting',
    name: 'SettingView',
    component: () => import('../views/SettingView.vue')
  },
  {
    path: '/userCard',
    name: 'UserCardView',
    component: () => import('../views/UserCardView.vue')
  },
  {
    path: '/chat',
    name: 'ChatView',
    component: () => import('../views/ChatView.vue')
  },
  {
    path: '/chat/group-chat',
    name: 'GroupChat',
    component: () => import('../views/GroupChat.vue')
  },


]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
