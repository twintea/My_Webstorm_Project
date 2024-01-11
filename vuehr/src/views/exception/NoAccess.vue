<template>
  <div style="text-align: center">
    <h2 style="color: #8c939d">您没有权限访问该页面...</h2>
    <el-button size="big" type="primary" @click="goHome">点击返回主页</el-button>
    <div>
      <img src="../../assets/exceptionImg/403.png" style="width: 400px;height: 400px">
    </div>
  </div>
</template>

<script>
export default {
  name: "NoAccess",
  methods:{
    goHome(){
      this.$router.replace('/home')
    }
  }
}
</script>

<style scoped>

</style>