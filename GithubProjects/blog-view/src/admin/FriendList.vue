<template>
  <div>

    <!--添加-->
    <el-form inline>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addDialogVisible=true">添加友链</el-button>
      </el-form-item>
      <el-form-item style="margin-left: 20px">
        <el-switch v-model="infoForm.commentEnabled" active-text="页面评论" @change="commentEnabledChanged"></el-switch>
      </el-form-item>
    </el-form>

    <el-table :data="friendList">
<!--      <el-table-column label="序号" type="index" width="120"></el-table-column>-->
      <el-table-column label="序号" type="index" ></el-table-column>
<!--      <el-table-column label="头像" width="180">-->
      <el-table-column label="头像" >
        <template v-slot="scope">
          <el-avatar shape="square" :size="60" fit="contain" :src="scope.row.logo"></el-avatar>
        </template>
      </el-table-column>
<!--      <el-table-column label="昵称" prop="name" width="200"></el-table-column>-->
      <el-table-column label="昵称" prop="name" ></el-table-column>
<!--      <el-table-column label="描述" prop="description" width="320"></el-table-column>-->
      <el-table-column label="描述" prop="description" ></el-table-column>
<!--      <el-table-column label="站点" prop="address" width="400"></el-table-column>-->
      <el-table-column label="站点" prop="address"></el-table-column>
<!--      <el-table-column label="是否通过审核" width="100">-->
      <el-table-column label="是否通过审核">
        <template v-slot="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"  @change="friendPublishedChanged(scope.row.id)"></el-switch>
        </template>
      </el-table-column>
<!--      <el-table-column label="浏览次数" prop="views" width="100"></el-table-column>-->
<!--      <el-table-column label="创建时间" width="170">-->
      <el-table-column label="创建时间" >
        <template v-slot="scope">{{ scope.row.createTime}}</template>
      </el-table-column>


<!--      <el-table-column label="操作" width="200">-->
      <el-table-column label="操作" >
        <template v-slot="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-popconfirm icon="el-icon-delete" iconColor="red" title="确定删除吗？" @confirm="deleteFriendById(scope.row.id)">
            <el-button slot="reference" icon="el-icon-delete" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.currentPage"
                   :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pageSize" :total="total"
                   layout="total, sizes, prev, pager, next, jumper" background>
    </el-pagination>



    <!--添加友链对话框-->
    <el-dialog title="添加友链" width="40%" :visible.sync="addDialogVisible" :close-on-click-modal="false" @close="addDialogClosed">
      <!--内容主体-->
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="80px">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
        <el-form-item label="网站" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="头像URL" prop="logo">
          <el-input v-model="addForm.logo"></el-input>
        </el-form-item>
        <el-form-item label="是否公开" prop="status">
          <el-switch active-value="0" inactive-value="1" v-model="addForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <!--底部-->
      <span slot="footer">
				<el-button @click="addDialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="saveFriend">确 定</el-button>
			</span>
    </el-dialog>

    <!--编辑友链对话框-->
    <el-dialog title="编辑友链" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="editDialogClosed">
      <!--内容主体-->
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="80px">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="网站" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="头像URL" prop="logo">
          <el-input v-model="editForm.logo"></el-input>
        </el-form-item>
        <el-form-item label="是否公开" prop="published">
          <el-switch active-value="0" inactive-value="1" v-model="editForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <!--底部-->
      <span slot="footer">
				<el-button @click="editDialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="editFriend">确 定</el-button>
			</span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "FriendList",
  data() {
    return {
      infoForm: {
        content: '',
        commentEnabled: true,
      },
      queryInfo: {
        currentPage: 1,
        pageSize: 10
      },
      friendList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        name: '',
        description: '',
        address: '',
        logo: '',
        status: 2
      },
      editForm: {
        name: '',
        description: '',
        address: '',
        logo: '',
        status: 2
      },
      formRules: {
        name: [{required: true, message: '请输入昵称', trigger: 'blur'}],
        description: [{required: true, message: '请输入描述', trigger: 'blur'}],
        address: [{required: true, message: '请输入网站', trigger: 'blur'}],
        logo: [{required: true, message: '请输入头像URL', trigger: 'blur'}],
      }
    }
  },
  methods:{
    //获取当前分页的友链
    getFriendList() {
      const _this = this
      this.$axios.get('/friendList?currentPage=' + this.queryInfo.currentPage+"&pageSize=" + this.queryInfo.pageSize).then((res) => {
        _this.friendList = res.data.data.records
        _this.total =Number(res.data.data.total)
        //console.log(_this.blogList)
      });
    },

    handleCurrentChange(newPage) {
      this.queryInfo.currentPage = newPage
      this.getFriendList()
    },
    handleSizeChange(newPageSize){
      this.queryInfo.pageSize = newPageSize
      this.getFriendList()

    },
    showEditDialog(row){
      this.editForm = row
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.editForm = {}
      this.editDialogVisible = false
    },

    deleteFriendById(id) {
      const _this = this
      this.$axios.get('/friend/delete/' + id).then((res) => {
        _this.$alert('操作成功', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            _this.getFriendList()
            //_this.$router.push("/blogList")
          }
        })
      })
    },


    friendPublishedChanged(id,status){
      const _this = this
      this.$axios.get('/friend/publish/'+id).then((res) => {
        _this.$alert('操作成功', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            _this.getFriendList()
            //_this.$router.push("/blogList")
          }
        })
      })

    },
    saveFriend(){
      const _this = this
      this.$axios.post('/friend/create',this.addForm).then((res) => {
        _this.$alert('操作成功', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            _this.addDialogVisible = false

            _this.getFriendList()
            //_this.$router.push("/blogList")
          }
        })
      });
      this.$refs['addFormRef'].resetFields();
    },
    editFriend(){
        const _this = this
        this.$axios.post('/friend/update', this.editForm).then(res => {
          _this.$alert('操作成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              _this.editDialogVisible = false
              _this.getFriendList()
            }
          });
        });

    },
    commentEnabledChanged(){

    },
    addDialogClosed(){
      this.addDialogVisible = false
    },

  },
  created() {
    this.getFriendList()
  }
}


</script>

<style scoped>
.el-button + span {
  margin-left: 10px;
}

.el-form {
  margin-top: 15px !important;
}

.el-form--inline .el-form-item {
  margin-bottom: 0;
}

</style>