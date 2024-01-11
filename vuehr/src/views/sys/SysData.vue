<template>

  <div v-loading.fullscreen.lock="loading"
       element-loading-text="恢复数据库耗时较长，请耐心等待..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div style="margin-top: 20px">
      <p>恢复数据库耗时较长，请谨慎选择</p>
      <el-button type="primary" size="large" @click="open">恢复数据库</el-button></div>
    <div>{{timeCost}}</div>
  </div>

</template>

<script>
export default {
  name: "SysData",
  data() {
    return{
      timeCost: '',
      loading: false
    }
  },
  methods: {
    open() {
      this.$confirm('此操作将恢复数据库到管理员设置的初始状态,此前修改将全部丢失， 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.getRequest("/system/init/vhrsql/").then(resp =>{
          this.loading = false;
          if (resp){
            this.timeCost= resp.data;
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>