import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapse: false,
    userInfo: {}
  },
  mutations: {
    setisCollapse (state) {
      state.isCollapse = !state.isCollapse
    },
    setUserInfo (state) {
      Vue.prototype.$http({
        url: '/mp/v1_0/user/profile',
        method: 'GET'
      })
        .then(res => {
          console.log(res)
          state.userInfo = res
        })
    }
  }
})
