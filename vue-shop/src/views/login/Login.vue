<template>
  <div>
    <el-form ref="form" :model="loginForm">
      <h3>系统登录</h3>
      <el-form-item>
        <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item >
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item >
        <el-input type="text" v-model="loginForm.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item>
        <img :src="imgUrl" >
          <el-checkbox v-model="checked" >记住我</el-checkbox>
          <el-button type="primary" style="width: 100%">登录</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
        imgUrl: ''
      }
    }
  }
}

</script>

<style scoped>

</style>