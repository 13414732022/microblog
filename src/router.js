import Vue from 'vue'
import Router from 'vue-router'
import home from './views/home'
import login from './views/login'
import layout from './views/layout/index.vue'
import publish from './views/article/publish'
import List from './views/article/list'
import comment from './views/article/comment/comment .vue'
import material from './views/article/material/index.vue'
import user from './views/user/user.vue'
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/article',
      component: layout,
      children: [
        {
          path: '/home',
          component: home
        },
        {
          path: 'publish', // 发表文章
          component: publish
        },
        {
          path: 'list', // 文章列表
          component: List
        },
        {
          path: 'edit/:id', // 文章编辑
          component: publish
        },
        {
          path: '/comment', // 评论列表
          component: comment
        },
        {
          path: '/material', // 素材列表
          component: material
        },
        {
          path: '/user/center', // 素材列表
          component: user
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    let obj = window.localStorage.getItem('userInfo')
    if (!obj) {
      router.push('/login')
    }
  }
  next()
})

export default router
