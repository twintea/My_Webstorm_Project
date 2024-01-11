import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/Login'
import Register from '@/views/Register'

Vue.use(VueRouter)

const routes = [
  // {path: '/', redirect: '/login'},
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = new VueRouter({
  routes
})

export default router
