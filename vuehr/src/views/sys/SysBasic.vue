<template>
<div>
  <el-tabs v-model="activeName" type="card" >
    <el-tab-pane label="部门管理" name="first"><DeptManage/></el-tab-pane>
    <el-tab-pane label="职位管理" name="second"><PosManage/></el-tab-pane>
    <el-tab-pane label="职称管理" name="third"><JobLevel/></el-tab-pane>
    <el-tab-pane label="奖惩规则" name="fourth"><EcManage/></el-tab-pane>
    <el-tab-pane label="权限组" name="fifth"><PermissManage/></el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import DeptManage from "@/components/sys/basic/DeptManage";
import EcManage from "@/components/sys/basic/EcManage";
import JobLevel from "@/components/sys/basic/JobLevel";
import PermissManage from "@/components/sys/basic/PermissManage";
import PosManage from "@/components/sys/basic/PosManage";

export default {
  name: "SysBasic",
  data(){
    return{
      activeName: 'first',
    }
  },
  components:{
    DeptManage,
    EcManage,
    JobLevel,
    PermissManage,
    PosManage
  }
}
</script>

<style scoped>

</style>