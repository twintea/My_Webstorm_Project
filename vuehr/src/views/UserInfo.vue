<template>

    <div >
      <div class="card-container">
        <el-card class="hr-card" v-loading="loading">
          <div slot="header">
            <img style=" width: 150px;height:150px;border-radius: 100px" :src="hr.userface" :alt="hr.name"
                 :title="hr.name" @click="urlImgVisible=true">
            {{ hr.name }}
          </div>
          <div>
            <el-descriptions direction="vertical" :column="2" border>
              <el-descriptions-item label="用户名">{{ hr.name }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ hr.phone }}</el-descriptions-item>
              <el-descriptions-item label="电话号码">{{ hr.telephone }}</el-descriptions-item>
              <el-descriptions-item label="地址">{{ hr.address }}</el-descriptions-item>
              <el-descriptions-item label="用户角色" :span="4">
                <el-tag size="small" style="margin-right: 3px" v-for="(role,index2) in hr.roles" :key="index2">
                  {{ role.namezh }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="是否可用">
                <el-switch
                    v-model="hr.enabled"
                    :disabled="true"
                    active-text="可用"
                    inactive-text="禁用">
                </el-switch>
              </el-descriptions-item>
              <el-descriptions-item label="备注">{{ hr.remark }}</el-descriptions-item>
              <el-descriptions-item label="操作">
                <el-button @click="pwdDialogVisible=true">修改密码</el-button>
                <el-button type="primary" @click="dialogVisible=true">修改信息</el-button>
              </el-descriptions-item>
            </el-descriptions>
            <!--            修改信息对话框-->
            <el-dialog
                title="修改用户信息"
                :visible.sync="dialogVisible"
                width="30%"
            >
              <div>
                <table>
                  <tr>
                    <td>
                      <el-tag>用户昵称:</el-tag>
                    </td>
                    <td>
                      <el-input v-model="hr2.name"></el-input>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <el-tag>电话号码:</el-tag>
                    </td>
                    <td>
                      <el-input v-model="hr2.telephone"></el-input>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <el-tag>手机号码:</el-tag>
                    </td>
                    <td>
                      <el-input v-model="hr2.phone"></el-input>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <el-tag>用户地址:</el-tag>
                    </td>
                    <td>
                      <el-input v-model="hr2.address"></el-input>
                    </td>
                  </tr>
                </table>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateUser">确 定</el-button>
              </span>
            </el-dialog>
            <!--            修改密码对话框-->
            <el-dialog
                title="修改用户密码"
                :visible.sync="pwdDialogVisible"
                width="30%"
            >
              <div>
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                         class="demo-ruleForm">
                  <el-form-item label="请输入原密码" prop="oldPass">
                    <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="请输入新密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-dialog>
            <!--           修改头像对话框架-->
            <el-dialog
                center
                title="修改头像"
                :visible.sync="urlImgVisible"
                width="27%">
              <div>
                <el-button type="primary" @click="showLocalUploadVisible"
                           v-show="!localUploadVisible">从本地上传头像
                </el-button>
                <el-button type="primary" @click="showUrlUploadVisible"
                           v-show="!urlUploadVisible">修改头像url地址
                </el-button>
                <!--                本地上传图片修改-->
                <el-upload style="margin-top: 10px"
                           v-show="localUploadVisible"
                           class="avatar-uploader"
                           action="/user/userInfo/fileUpload/userface"
                           :show-file-list="false"
                           :on-success="handleSuccess"
                           :data="hr"
                           :on-preview="handlePictureCardPreview"
                           :before-upload="beforeAvatarUpload">
                  <img v-if="userfaceUrl" :src="userfaceUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-button v-show="localUploadVisible" style="position:absolute;right:20px;bottom:20px;"
                           type="primary" @click="uploadImg">确 定
                </el-button>


                <!--               头像url地址修改-->
                <table style="margin-top: 10px" v-show="urlUploadVisible">
                  <tr>
                    <td>头像url地址：</td>
                    <td>
                      <el-input v-model="imgUrl" style="width: 110%" clearable></el-input>
                    </td>
                  </tr>
                </table>
              </div>
              <span v-show="urlUploadVisible" slot="footer" class="dialog-footer">
                    <el-button @click="urlImgVisible = false">取 消</el-button>
                    <el-button type="primary" @click="doUpdateUrlImg">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <div>
          </div>

        </el-card>
      </div>
    </div>

</template>

<script>
export default {
  name: "UserInfo",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      imgUrl: '',
      userfaceUrl: null,
      localUploadVisible: false,
      urlUploadVisible: false,
      urlImgVisible: false,
      ruleForm: {
        oldPass: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        oldPass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
      },
      pwdDialogVisible: false,
      dialogVisible: false,
      hr: {},
      hr2: {},
    }
  },
  mounted() {
    this.initCurrentUser();
  },
  methods: {
    doUpdateUrlImg() {
      this.postRequest('/user/userInfo/fileUpload/userface/?id=' + this.hr.id + '&userface=' + this.imgUrl).then(resp => {
        if (resp) {
          this.userfaceUrl = null;
          this.imgUrl = '';
          this.urlUploadVisible = false;
          this.urlImgVisible = false;
          this.initCurrentUser();
        }
      })
    },
    uploadImg() {
      this.userfaceUrl = null;
      this.localUploadVisible = false;
      this.urlImgVisible = false;
      this.initCurrentUser();
    },
    handlePictureCardPreview(file) {
      this.userfaceUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG) {
        this.$message.error('上传头像图片只能是 png 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isPNG && isLt2M;
    },


    handleSuccess(response, file) {
      this.userfaceUrl = file.response.data;
    },
    showLocalUploadVisible() {
      this.urlUploadVisible = false;
      this.localUploadVisible = true;
    },
    showUrlUploadVisible() {
      this.localUploadVisible = false;
      this.urlUploadVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.hrid = this.hr.id
          this.putRequest('/user/userInfo/hr/passwd', this.ruleForm).then(resp => {
            if (resp) {
              this.getRequest('/logout');
              window.sessionStorage.removeItem('user');
              this.$store.commit('initRoutes', [])
              this.$router.replace('/')
            }
          })
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updateUser() {
      this.putRequest('/user/userInfo/', this.hr2).then(resp => {
        if (resp) {
          this.dialogVisible = false;
          this.initCurrentUser();
        }
      })
    },
    initCurrentUser() {
      this.loading = true;
      this.getRequest('/user/userInfo/').then(resp => {
        this.loading = false;
        if (resp) {
          this.hr = resp;
          this.imgUrl = this.hr.userface
          this.hr2 = Object.assign({}, this.hr)
          window.sessionStorage.setItem('user', JSON.stringify(resp))
          this.$store.commit('INIT_CURRENTHR', resp)
        }
      })
    }
  }
}

</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.card-container {
  margin-top: 30px;
}

.hr-card {
  margin-bottom: 30px;
  border-radius: 30px;
}
</style>