import Vue from 'vue'
import Router from 'vue-router'

// @表示的src的绝对路由
import Home from '@/components/Home'
import Login from '@/components/Login'
// 导入Users组件
import Users from '@/components/Users'

Vue.use(Router)

const router = new Router({
  routes: [

    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,

      // 用于配置home路由的子路由Users
      children: [{
        path: '/users',
        component: Users
      }]
    }
  ]
})

// 给router对象注册导航守卫
router.beforeEach((to, from, next) => {
  // 如果是去登录的，放行
  if (to.path === '/login') {
    next()
    return
  }
  // 如果不是登录的，判断是否有token，如果有，放走
  // 如果没有，去登录
  let token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router
