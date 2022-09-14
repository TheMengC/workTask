import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { Login, GetFriendsList, Layout } from '@/api'
import { setToken, removeToken } from '@/api/token'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: "",
    userInfo: {},
    friendsList: [],
    msgList: []
  },
  getters: {
  },
  mutations: {
    GET_TOKEN(state, token) {
      state.token = token
    },
    GET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
    },
    GET_FRIENDS_LIST(state, friendsList) {
      state.friendsList = friendsList
    },
    REMOVE_TOKEN(state) {
      state.token = ""
    },
    MSG_LIST(state, amount) {
      state.msgList = amount
    }
  },
  actions: {
    ToLogin({ commit }, userInfo) {
      const { telephone, password } = userInfo
      return new Promise((resolve, reject) => {
        Login({ telephone: telephone.trim(), password: password })
          .then(async res => {
            if (res.data.code === 200) {
              commit("GET_TOKEN", res.data.token)
              setToken(res.data.token)
              commit("GET_USERINFO", res.data.data)
              resolve(res.data.data)
            } else {
              reject(res.data)
            }
          })
      })
    },
    ToFriendsList({ commit }) {
      return new Promise((resolve, reject) => {
        GetFriendsList()
          .then(async res => {
            if (res.data.code === 200) {
              commit('GET_FRIENDS_LIST', res.data.contactList)
              resolve(res.data)
            } else {
              reject(res.data)
            }
          })
      })
    },
    ToLayout({ commit }) {
      return new Promise((resolve, reject) => {
        Layout().then(async res => {
          if (res.data.code === 200) {
            resolve(res.data)
            commit('REMOVE_TOKEN')
            removeToken()
          } else {
            reject(res.data)
          }
        })
      })
    },
    ToMsgList({ commit }, { amount }) {
      commit('MSG_LIST', amount)
    }
  },
  modules: {
  }
})
