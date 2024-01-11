<template>
  <div>
    <div class="permissAddInput">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" placeholder="请输入角色中文名" @keydown.enter.native="doAdd" v-model="role.namezh"/>
      <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="doAdd" :loading="loading">添加</el-button>
    </div>
    <div style="margin-top: 12px;width: 700px">
      <el-collapse v-model="activeName" v-for="(item,index) in roles" :key="index" accordion @change="change">
        <el-collapse-item :title="item.namezh" :name="item.id">
          <el-card shadow="hover" class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <el-button style="float: right; padding: 3px 0; color: crimson; font-size: smaller"
                         icon="el-icon-delete" type="text" @click="deleteRole(item)">删除
              </el-button>
            </div>
            <div v-loading="loading">
              <el-tree show-checkbox
                       ref="tree"
                       :data="menus"
                       :key="index"
                       node-key="id"
                       :default-checked-keys="selectedMenus"
                       :props="defaultProps"></el-tree>
              <div style="display:flex;justify-content: flex-end">
                <el-button @click="cancelUpdate">取消修改</el-button>
                <el-button type="primary" @click="doUpdate(item.id,index)" :loading="loading">确认修改</el-button>
              </div>

            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissManage",
  data() {
    return {
      loading: false,
      activeName: -1,
      selectedMenus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menus: [],
      roles: [],
      role: {
        name: '',
        namezh: '',
      }
    }
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    deleteRole(role) {
      this.$confirm('此操作将永久删除【' + role.namezh + '】角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading=true;
        this.deleteRequest('/system/basic/permiss/deleteRole/' + role.id).then(resp => {
          this.loading=false;
          if (resp) {
            this.initRoles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAdd() {
      if (this.role.name && this.role.namezh) {
        this.loading=true;
        this.postRequest("/system/basic/permiss/addRole/", this.role).then(resp => {
          this.loading=false;
          if (resp) {
            this.role.name = ''
            this.role.namezh = ''
            this.initRoles();
          }
        })
      } else {
        this.$message.error("数据不能为空！");
      }
    },
    cancelUpdate() {
      this.activeName = -1
    },
    change(rid) {

      if (rid) {
        this.initMenus();
        this.initSelectedMenus(rid)
      }
    },
    doUpdate(rid, index) {

      let tree = this.$refs.tree[index]
      let selectedKeys = tree.getCheckedKeys(true)
      let url = '/system/basic/permiss/?rid=' + rid
      selectedKeys.forEach(key => {
        url += '&mids=' + key
      })
      this.loading=true;
      this.putRequest(url).then(resp => {
        this.loading=false;
        if (resp) {
          this.activeName = -1
        }
      })
    },
    initSelectedMenus(rid) {
      this.loading=true;
      this.getRequest("/system/basic/permiss/mids/" + rid).then(resp => {
        this.loading=false;
        if (resp) {
          this.selectedMenus = resp.data
        }
      })
    },
    initMenus() {
      this.loading=true;
      this.getRequest('/system/basic/permiss/menu').then(resp => {
        this.loading=false;
        if (resp) {
          this.menus = resp.data;
        }
      })
    },
    initRoles() {
      this.loading=true;
      this.getRequest('/system/basic/permiss/').then(resp => {
        this.loading=false;
        if (resp) {
          this.roles = resp.data;
        }
      })
    }
  }
}
</script>

<style scoped>
.permissAddInput .el-input {
  width: 300px;
  margin-right: 7px;
}
</style>