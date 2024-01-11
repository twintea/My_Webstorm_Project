<template>
  <div>
    <div>
      <el-container>
        <el-header class="homeHeader">
          <div class="title">Space人事</div>
          <div>
            <el-tooltip class="item" effect="dark" content="在线聊天" placement="bottom">
              <el-button icon="el-icon-bell" style="color: #b2e281;margin-right: 8px" size="normal" type="text"
                         @click="goChat"></el-button>
            </el-tooltip>
            <el-dropdown class="userInfo" @command="commandHandler">
  <span class="el-dropdown-link">
    {{ user.name }}<i><img :src="user.userface"></i>
  </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                <el-dropdown-item command="setting" disabled>设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-container>
          <el-aside width="200px" unique-opened>
            <el-menu router background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b">
              <el-submenu :index="index+''" v-for="(item,index) in this.routes" v-if="!item.hidden" :key="index">
                <template slot="title">
                  <i style="margin-right: 5px" :class="item.iconCls"></i>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item :index="child.path" v-for="(child,indexj) in item.children"
                              :key="indexj">
                  <i style="color: darksalmon" :class="child.iconCls"></i>
                  {{ child.name }}
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="homeWelcome" v-else>
              <p>欢迎 {{ user.name }}!</p>
              <img src="../assets/png/新品宣导.png" width="60%" height="60%">
            </div>
            <router-view class="homeRouterView"/>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div>
      <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          >
        <span>{{ msg }}</span>
        <span slot="footer" class="dialog-footer">
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import '../assets/png/新品宣导.png'

export default {
  name: "Home",
  data() {
    return {
      // user: JSON.parse(window.sessionStorage.getItem("user"))
      msg: '欢迎来到Space人事项目！这里做一些简单的介绍：左侧菜单栏带有图标的菜单可正常点击并已实现相关功能，祝您浏览愉快！',
      dialogVisible: false
    }
  },
  computed: {
    routes() {
      this.dialogVisible = true;
      return this.$store.state.routes;
    },
    user() {
      return this.$store.state.currentHr;
    },
  },
  methods: {
    goChat() {
      this.$router.push('/chat')
    },
    commandHandler(cmd) {
      if (cmd == 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest("/logout")
          window.sessionStorage.removeItem("user")
          this.$store.commit('initRoutes', []);
          this.$router.replace("/")
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消注销'
          });
        });
      } else if (cmd == 'userInfo') {
        this.$router.push('/userInfo')
      }
    }
  }
}
</script>

<style>

.el-main {
  position: absolute;
  left: 200px;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}

.el-header {
  position: relative;
  width: 100%;
  height: 60px;
}

.el-aside {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  background-color: #545c64;
}

.homeRouterView {
  margin-top: 10px;
}

.homeWelcome {
  font-size: 30px;
  font-family: "华文隶书";
  color: cornflowerblue;
}

.el-aside::-webkit-scrollbar {
  display: none;
}

.homeHeader {
  background-color: #26292E;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}

.title {
  font-size: 30px;
  font-family: 华文琥珀;
  color: white;
}

.userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}
</style>