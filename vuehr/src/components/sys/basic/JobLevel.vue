<template>
  <div>
    <div>
      <el-input size="small"
                style="width: 300px"
                prefix-icon="el-icon-circle-plus-outline"
                placeholder="添加职位"
                @keydown.enter.native="addJl"
                v-model="jl.name">
      </el-input>

      <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small" style="margin-left: 7px;margin-right: 7px">
        <el-option
            v-for="item in titleLevels"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addJl" :loading="loading">添加
      </el-button>
    </div>
    <div>
      <el-table
          v-loading="loading"
          :data="jls"
          stripe
          border
          size="medium"
          @selection-change="handleSelectionChange"
          style="width: 70%;margin-top: 10px">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职称名称"
            width="150">
        </el-table-column>
        <el-table-column
            prop="titleLevel"
            label="职称级别">
        </el-table-column>
        <el-table-column
            prop="enabled"
            label="是否启用">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled==1" type="success">已启用</el-tag>
            <el-tag v-else type="danger">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间">
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
    <!--    修改-->
    <div>
      <el-dialog title="职称管理" :visible.sync="dialogFormVisible">
        <el-form :model="updateJls" :rules="rules" ref="JlForm">
          <el-form-item label="编号" :label-width="formLabelWidth">
            <el-input v-model="updateJls.id" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="职称名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="updateJls.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="职称级别" :label-width="formLabelWidth">
            <el-select v-model="updateJls.titleLevel" :placeholder="updateJls.titleLevel" size="small"
                       style="margin-left: 7px;margin-right: 7px">
              <el-option
                  v-for="item in titleLevels"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用" :label-width="formLabelWidth">
            <el-switch
                v-model="updateJls.enabled"
                :active-value="1"
                :inactive-value="0"
                active-text="已启用"
                inactive-text="禁用">
            </el-switch>
          </el-form-item>
          <el-form-item label="创建时间" :label-width="formLabelWidth">
            <el-input v-model="updateJls.createDate" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="doUpdate" :loading="loading">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-button type="danger" size="small" style="margin-top: 10px"
               :disabled="multipleSelection.length==0"
               @click="deleteMany" :loading="loading">批量删除
    </el-button>
  </div>
</template>

<script>
export default {
  name: "JobLevel",
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      multipleSelection: [],
      jl: {
        name: '',
        titleLevel: ''
      },
      jls: [],
      updateJls: {
        id: '',
        name: '',
        titleLevel: '',
        enabled: '',
        createDate: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入职称名称', trigger: 'blur'},
          {
            pattern: "^[\u4e00-\u9fa5_a-zA-Z0-9]+$",    //正则校验不用字符串
            message: "请填写正确的职称名称", trigger: "blur"
          }

        ],
      },

      titleLevels: [
        "正高级",
        "副高级",
        "中级",
        "初级",
        "员级",
      ],
    }
  },
  mounted() {
    this.initJls()
  },
  methods: {
    deleteMany() {
      this.loading = true;
      let ids = '';
      this.multipleSelection.forEach(item => {
        ids += "ids=" + item.id + "&";
      })
      this.deleteRequest("/system/basic/jl/?" + ids).then(resp => {
        this.loading = false;
        if (resp) {
          this.initJls();
        }
      })


    },
    doUpdate() {
      this.$refs.JlForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.putRequest("/system/basic/jl/", this.updateJls).then(resp => {
            this.loading = false;
            if (resp) {
              this.initJls();
              this.dialogFormVisible = false;
            }
          })
        } else {
          this.$message.error("字段不合法！");
          return false;
        }

      })

    },
    addJl() {
      if (this.jl.name && this.jl.titleLevel) {
        this.loading = true;
        this.postRequest("/system/basic/jl/", this.jl).then(resp => {
          this.loading = false;
          if (resp) {
            this.initJls();
            this.jl.name = ''
            this.jl.titleLevel = ''
          }
        })
      } else {
        this.$message.error("请完整填写职位名称和职位等级！")
      }

    },
    handleEdit(index, data) {
      Object.assign(this.updateJls, data)
      this.dialogFormVisible = true
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除【' + data.name + '】职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.deleteRequest("/system/basic/jl/" + data.id).then(resp => {
          this.loading = false;
          if (resp) {
            this.initJls();
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
    initJls() {
      this.loading = true
      this.getRequest("/system/basic/jl/").then(resp => {
        this.loading = false
        if (resp) {
          this.jls = resp.data;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>