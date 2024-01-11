<template>
  <div style="text-align: center">
    <h2 style="color: #8c939d">`(*>﹏<*)′服务器局部发生故障，正在抢修中...</h2>
    <el-button size="big" type="primary" @click="goHome">点击返回主页</el-button>
    <div>
      <img src="../../assets/exceptionImg/500.png" style="width: 400px;height: 400px">
    </div>
  </div>
</template>

<script>
export default {
  name: "SysException",
  methods:{
    goHome(){
      this.$router.replace('/home')
    }
  }
}
</script>

<style scoped>

</style>