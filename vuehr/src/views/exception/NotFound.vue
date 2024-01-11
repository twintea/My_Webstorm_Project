<template>
  <div style="text-align: center">
    <h2 style="color: #8c939d">抱歉，您输入的地址没有找到</h2>
    <h3 style="color: #8c939d">o(╥﹏╥)o</h3>
    <el-button size="big" type="primary" @click="goHome">点击返回主页</el-button>
  <div>
    <img src="../../assets/exceptionImg/404.png" style="width: 400px;height: 400px">
  </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods:{
    goHome(){
      this.$router.replace('/home')
    }
  }
}
</script>

<style scoped>

</style>