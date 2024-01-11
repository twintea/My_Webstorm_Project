import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import {postKeyValueRequest} from "@/utils/api";
import {postRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import FriendChat from "@/views/chat/FriendChat";
import UserInfo from "@/views/UserInfo";
import NotFound from "@/views/exception/NotFound";
import SysException from "@/views/exception/SysException";
import NoAccess from "@/views/exception/NoAccess";

Vue.prototype.postKeyValueRequest=postKeyValueRequest;
Vue.prototype.postRequest=postRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.deleteRequest=deleteRequest;


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    hidden: true,
    children:[
      {
        path: '/chat',
        name: '在线聊天',
        component: FriendChat,
        hidden: true
      },
      {
        path: '/userInfo',
        name: '个人信息',
        component: UserInfo,
        hidden: true
      }
    ]
  },
  // {
  //   path: '/500',
  //   name: '500',
  //   component: SysException
  // },
  {
    path: '/403',
    name: '无权限',
    component: NoAccess
  },
  {
    path: '*',
    name: '404',
    component: NotFound
  }
]

const router = new VueRouter({
  routes
})


export default router
