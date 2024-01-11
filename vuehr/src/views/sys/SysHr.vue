<template>
  <div>
    <div style="margin-top: 10px;display:flex;justify-content: center;">
      <el-input v-model="keywords" style="width: 400px;margin-right: 10px" @keydown.enter.native="doSearch"
                placeholder='请输入用户名搜索用户'></el-input>
      <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
    </div>
    <div class="card-container">
      <el-card class="hr-card" v-for="(hr,index) in hrs" :key="index">
        <div slot="header">
          <img class="userface-img" :src="hr.userface" :alt="hr.name" :title="hr.name">
          {{ hr.name }}
          <el-button size="medium" style="float: right; padding: 3px 0;color: crimson" type="text"
                     icon="el-icon-delete" @click="doDelete(hr)"></el-button>
        </div>
        <div class="userInfo-container">
          <el-descriptions direction="vertical" :column="2" border>
            <el-descriptions-item label="用户名">{{ hr.name }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ hr.phone }}</el-descriptions-item>
            <el-descriptions-item label="电话号码">{{ hr.telephone }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{ hr.address }}</el-descriptions-item>
            <el-descriptions-item label="用户角色" :span="4">
              <el-tag size="small" style="margin-right: 3px" v-for="(role,index2) in hr.roles" :key="index2">
                {{ role.namezh }}
              </el-tag>
              <el-popover
                  placement="bottom"
                  title="角色列表"
                  @show="showPop(hr)"
                  @hide="updateRole(hr)"
                  width="200"
                  trigger="click">
                <el-select v-model="selectedRoles" multiple placeholder="请选择">
                  <el-option
                      v-for="(r,indexk) in allRoles"
                      :key="indexk"
                      :label="r.namezh"
                      :value="r.id">
                  </el-option>
                </el-select>
                <el-button slot="reference"
                           size="medium" type="text"
                           icon="el-icon-edit" style="padding-right: 5px">
                </el-button>
              </el-popover>
            </el-descriptions-item>
            <el-descriptions-item label="是否可用">
              <el-switch
                  v-model="hr.enabled"
                  active-text="可用"
                  inactive-text="禁用"
                  @change="enabledChange(hr)">
              </el-switch>
            </el-descriptions-item>
            <el-descriptions-item label="备注">{{ hr.remark }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div>
        </div>

      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysHr",
  data() {
    return {
      selectedRoles: [],
      allRoles: [],
      keywords: '',
      hrs: [],
    }
  },
  mounted() {
    this.initHrs();
  },
  methods: {
    doDelete(hr) {
      this.$confirm('此操作将永久删除【' + hr.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/hr/' + hr.id).then(resp => {
          if (resp) {
            this.initHrs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    doSearch() {
      this.initHrs();
    },
    updateRole(hr) {
      //识别用户角色是否被更改，只有更改了才调请求
      let roles = hr.roles
      let flag = false
      let srIds = []
      Object.assign(srIds, this.selectedRoles)
      // debugger
      if (roles.length == srIds.length) {
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i];
          for (let j = 0; j < srIds.length; j++) {
            let sr = srIds[j]
            if (sr == role.id) {
              //比较有一个相同，移除
              srIds.splice(j, 1);
              break;
            }
          }
        }
        //全部比较完,全部相同
        if (srIds.length == 0) {
          flag = true;
        }
      }
      if (flag) {
        return;
      }
      let url = '/system/hr/role?hrid=' + hr.id
      this.selectedRoles.forEach(sr => {
        url += '&rids=' + sr
      })
      this.putRequest(url).then(resp => {
        if (resp) {
          this.initHrs()
        }
      })
    },
    showPop(hr) {
      this.initAllRoles()
      let roles = hr.roles
      this.selectedRoles = []
      roles.forEach(r => {
        this.selectedRoles.push(r.id)
      })
    },
    initAllRoles() {
      this.getRequest('/system/hr/roles/').then(resp => {
        if (resp) {
          this.allRoles = resp.data
        }
      })
    },
    enabledChange(hr) {
      delete hr.roles;
      this.putRequest("/system/hr/", hr).then(resp => {
        if (resp) {
          this.initHrs();
        }
      })
    },
    initHrs() {
      this.getRequest("/system/hr/?keyWords=" + this.keywords).then(resp => {
        if (resp) {
          this.hrs = resp.data;

        }
      })
    },
  }
}
</script>

<style scoped>
.userInfo-container {

}

.userface-img {
  width: 72px;
  height: 72px;
  border-radius: 72px;
}

.card-container {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.hr-card {
  width: 400px;
  margin-bottom: 30px;
  border-radius: 30px;
}
</style>