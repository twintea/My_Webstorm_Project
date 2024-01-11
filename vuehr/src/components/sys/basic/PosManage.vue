<template>
  <div>
    <div>
      <el-input
          size="small"
          style="width: 300px;margin-right: 8px"
          placeholder="添加职位"
          prefix-icon="el-icon-circle-plus-outline"
          @keydown.enter.native="addPos"
          v-model="pos.name">
      </el-input>
      <el-button icon="el-icon-circle-plus-outline" size="small" type="primary" @click="addPos" :loading="loading">添加</el-button>
    </div>
    <div class="posManageMain">
      <el-table
          v-loading="loading"
          :data="positions"
          stripe
          border
          size="medium"
          style="width: 70%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="70">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职位名称"
            width="200">
        </el-table-column>
        <el-table-column
            prop="enabled"
            label="是否启用"
            width="200">
          <template slot-scope="scope">
            <el-tag type="success" size="small" v-if="scope.row.enabled==1">已启用</el-tag>
            <el-tag type="danger" size="small" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建日期"
            width="170">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button type="danger" size="small" style="margin-top: 10px"
               :disabled="multipleSelection.length==0" @click="deleteMany">批量删除
    </el-button>
    <div>
      <!-- Form -->

      <el-dialog title="职位修改" :visible.sync="dialogFormVisible">
        <el-form :model="pos">
          <el-form-item label="编号" :label-width="formLabelWidth">
            <el-input v-model="updatePos.id" :disabled="true" autocomplete="false"></el-input>
          </el-form-item>
          <el-form-item label="职位名称" :label-width="formLabelWidth">
            <el-input v-model="updatePos.name" autocomplete="false"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" :label-width="formLabelWidth">
            <el-switch
                v-model="updatePos.enabled"
                :active-value="1"
                :inactive-value="0"
                active-text="已启用"
                inactive-text="禁用">
            </el-switch>
          </el-form-item>
          <el-form-item label="创建日期" :label-width="formLabelWidth">
            <el-input v-model="updatePos.createDate" :disabled="true" autocomplete="false"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="doUpdate" :loading="loading">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
export default {
  name: "PosManage",
  data() {
    return {
      loading: false,
      //更新内容弹出的对话窗口
      dialogFormVisible: false,
      formLabelWidth: "100px",
      //多选
      multipleSelection: [],
      pos: {
        name: '',
      },
      updatePos: {
        name: '',
        id: '',
        enabled: '',
        createDate: ''
      },
      positions: [],
    }
  },
  methods: {

    deleteMany() {
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = "";
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.loading = true
        this.deleteRequest("/system/basic/pos/?"+ids).then(resp => {
          this.loading = false;
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    doUpdate() {
      this.loading = true;
      this.putRequest("/system/basic/pos/", this.updatePos).then(resp => {
        this.loading=false;
        if (resp) {
          this.initPositions();
          this.dialogFormVisible = false;
        }
      })
    },
    addPos() {
      if (this.pos.name) {
        this.loading=true
        this.postRequest("/system/basic/pos/", this.pos).then(resp => {
            this.loading=false;
          if (resp) {
            this.initPositions()
            this.pos.name = '';
          }
        })
      } else {
        this.$message.error("请输入职位名称！")
      }

    },
    initPositions() {
      this.loading=true
      this.getRequest("/system/basic/pos/").then(resp => {
        this.loading=false
        if (resp) {
          this.positions = resp.data;
        }
      })
    },
    handleEdit(index, data) {
      this.dialogFormVisible = true
      Object.assign(this.updatePos, data)
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading=true
        this.deleteRequest("/system/basic/pos/" + data.id).then(resp => {
          this.loading=false
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    }
  },
  mounted() {
    this.initPositions();
  }
}
</script>

<style scoped>
.posManageMain {
  margin-top: 10px;
}
</style>