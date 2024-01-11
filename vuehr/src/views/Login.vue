<template>
  <div class="loginContainer">
    <el-form :rules="rules" :model="loginForm" ref="loginForm">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item label="用户名:" prop="username">
        <el-input size="normal" type="text" v-model="loginForm.username" placeholder="请输入用户名"
                  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input size="normal" type="password" v-model="loginForm.password" placeholder="请输入密码"
                  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="验证码:" prop="code">
        <el-input style="width: 250px" size="normal" type="text" v-model="loginForm.code" placeholder="点击图片更换验证码"
                  auto-complete="off"
                  @keydown.enter.native="submitLogin"></el-input>
        <img :src="verifyCodeImg" @click="updateVerifyCode">
      </el-form-item>

      <el-form-item class="loginRemember">
        <el-checkbox size="normal" v-model="checked"></el-checkbox>
      </el-form-item>
      <el-button size="normal" type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      verifyCodeImg: '/verifyCode?time=' + new Date(),
      loginForm: {
        username: 'admin',
        password: '123',
        code: ''
      },
      checked: true,
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, message: '密码不小于3位', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],

      }

    }
  },
  methods: {
    updateVerifyCode() {
      this.verifyCodeImg = '/verifyCode?time=' + new Date();
    },
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在登录中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          setTimeout(() => {
            loading.close();
          }, 2000);
          //键值对传参
          // this.postKeyValueRequest('doLogin', this.loginForm).then(resp => {
          //Json传参
          this.postRequest('doLogin', this.loginForm).then(resp => {
            if (resp) {
              loading.close();
              // debugger;
              this.$store.commit('INIT_CURRENTHR', resp.data)
              window.sessionStorage.setItem('user', JSON.stringify(resp.data))
              let path = this.$route.query.redirect;
              this.$router.replace((path == '/' || path == undefined) ? '/home' : path)
            } else {
              this.updateVerifyCode()
            }
          })

        } else {
          this.$message.error("请输入所有字段！");
          return false;
        }
      });
    }
  }
}
</script>


<style>
.el-form-item__content {
  display: flex;
  align-items: center;
}

.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 15px auto 20px auto;
  text-align: center;
  color: #505458;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 5px 0px;
}
</style>