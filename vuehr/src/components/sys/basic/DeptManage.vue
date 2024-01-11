<template>
  <div>
    <div style="width: 470px" v-loading="loading">
      <el-input
          placeholder="输入部门名称进行搜索"
          prefix-icon="el-icon-search"
          v-model="filterText">
      </el-input>

      <el-tree
          class="filter-tree"
          :data="depts"
          :expand-on-click-node="false"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="tree">
       <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%"
             slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
              type="primary"
              size="mini"
              class="btn"
              @click="() => addDept(data)">
            添加部门
          </el-button>
          <el-button
              type="danger"
              size="mini"
              class="btn"
              @click="() => doDeleteDept(data)">
            删除部门
          </el-button>
        </span>
      </span>
      </el-tree>
    </div>
    <div>
      <!--      添加部门框-->
      <el-dialog
          title="添加部门"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
        <div style="width: 90%">
          <el-form label-position="left" ref="form" :model="dept" label-width="80px">
            <el-form-item label="上级部门">
              <el-input disabled="true" v-model="pname"></el-input>
            </el-form-item>
            <el-form-item label="部门名称">
              <el-input v-model="dept.name" placeholder="请输入部门名称"></el-input>
            </el-form-item>
          </el-form>


        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAdd" :loading="loading">确 定</el-button>
  </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
export default {
  name: "DeptManage",
  data() {
    return {
      loading: false,
      dept: {
        name: '',
        parentid: '',
      },
      pname: '',
      dialogVisible: false,
      filterText: '',
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initDepts();
  },
  methods: {
    //动态删除部门
    flushDeleteDep(p, deps, id) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i]
        if (d.id == id) {
          deps.splice(i, 1)
          if (deps.length == 0) {
            p.isParent = 0;
          }
          return
        } else {
          this.flushDeleteDep(d, d.children, id)
        }
      }
    },

    //动态添加部门 (添加部门之后不收起折叠)
    flushAddDep(deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        //如果添加部门的父部门是d，则将添加的部门拼接到d的children下
        if (d.id == dep.parentid) {
          d.children = d.children.concat(dep)
          if (d.children.length > 0) {
            d.isParent = 1;
          }
          return
        } else { //否则，看d的子部门下是否是添加进来部门的父部门
          this.flushAddDep(d.children, dep);
        }
      }
    },
    doAdd() {
      this.loading = true
      this.postRequest('/system/basic/dept/', this.dept).then(resp => {
        this.loading = false
        if (resp) {
          this.dialogVisible = false
          this.pname = ''
          this.dept.name = ''
          this.dept.parentid = ''
          this.flushAddDep(this.depts, resp.data)
        }
      })
    },
    addDept(data) {
      this.dialogVisible = true
      this.pname = data.name
      this.dept.parentid = data.id
    },
    doDeleteDept(data) {
      if (data.isParent == 1) {
        this.$message.error("该部门下有子部门，删除失败！");
        return;
      }
      this.$confirm('此操作将永久删除【' + data.name + '】部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.deleteRequest('/system/basic/dept/' + data.id).then(resp => {
          this.loading = false;
          if (resp) {
            this.flushDeleteDep(null, this.depts, data.id)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    initDepts() {
      this.loading = true;
      this.getRequest("/system/basic/dept/").then(resp => {
        this.loading = false;
        if (resp) {
          this.depts = resp.data;
        }
      })
    }
  }
}
</script>

<style scoped>
.btn {
  padding: 2px;
}
</style>