<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-input :disabled="showAdvanceSearch" placeholder="请输入员工姓名搜索"
                  style="margin-right: 10px;width: 200px"
                  v-model="searchValue.name"
                  @keydown.enter.native="initEmps"
                  clearable
                  @clear="initEmps">
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="initEmps" :disabled="showAdvanceSearch">搜索</el-button>
        <el-button type="primary" :icon="showAdvanceSearch?'el-icon-caret-top':'el-icon-caret-bottom'"
                   @click="showAdvanceSearch=!showAdvanceSearch">高级搜索
        </el-button>
      </div>
      <div>
        <el-button type="success" @click="exportData">导出数据</el-button>
        <el-button type="success" @click="importDialog=true">导入数据</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加用户</el-button>
      </div>
      <!--      高级搜索-->
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearch" style="border: 1px solid #409eff;
      border-radius: 5px; box-sizing: border-box;padding: 10px ; margin: 10px">
        <el-row>
          <el-col>
            员工姓名:
            <el-input placeholder="请输入员工姓名"
                      style="margin-right: 10px;width: 150px"
                      v-model="searchValue.name"
                      clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px ">
          <el-col :span="5">
            政治面貌:
            <el-select v-model="searchValue.politicId" clearable placeholder="请选择" style="width: 150px">
              <el-option
                  v-for="item in politicsstatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            民族:
            <el-select v-model="searchValue.nationId" clearable placeholder="请选择" style="width: 100px">
              <el-option
                  v-for="item in nation"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职位:
            <el-select style="width: 100px" v-model="searchValue.posId" clearable placeholder="请选择职位">
              <el-option
                  v-for="item in position"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职称:
            <el-select style="width: 130px" v-model="searchValue.jobLevelId" clearable placeholder="请选择职称">
              <el-option
                  v-for="item in joblevel"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            聘用形式:
            <el-radio-group v-model="searchValue.engageForm">
              <el-radio label="劳动合同">劳动合同</el-radio>
              <el-radio label="劳务合同">劳务合同</el-radio>
              <el-radio label="">不确定</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="5">
            所属部门:
            <el-cascader
                ref="searchDepts"
                v-model="searchValue.departmentId"
                :options="departments"
                :props="{ checkStrictly: true, label:'name', value: 'id'}"
                :show-all-levels="false"
                style="width: 150px"
                @change="AdvancedSearchDeptChange"
                clearable>
            </el-cascader>
          </el-col>
          <el-col :span="5">
            工号:
            <el-input v-model="searchValue.workId" placeholder="请输入工号" style="width: 150px"></el-input>
          </el-col>
          <el-col :span="10">
            入职日期:
            <el-date-picker
                v-model="searchValue.date"
                value-format="yyyy-MM-dd"
                unlink-panels
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="4">
            <el-button icon="el-icon-search" type="primary" @click="doAdvancedSearch">搜索</el-button>
            <el-button>取消</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <!--      导入数据对话框-->
    <div>
      <el-dialog
          title="导入数据"
          :visible.sync="importDialog"
          width="30%">
        <div style="text-align: center">
          <el-upload
              class="upload-demo"
              drag
              :on-success="importSuccess"
              :on-error="importError"
              action="/employee/basic/import/">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传（TODO）</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过500kb</div>
          </el-upload>
        </div>
      </el-dialog>
    </div>
    <!--    表格-->
    <div style="margin-top: 20px">
      <el-table
          :data="emps"
          border
          stripe
          v-loading="loading"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>

        <el-table-column
            prop="name"
            fixed
            width="90"
            align="left"
            label="姓名">
        </el-table-column>
        <el-table-column
            prop="gender"
            width="55"
            label="性别">
        </el-table-column>
        <el-table-column
            prop="workId"
            label="工号"
            width="85"
            align="left">
        </el-table-column>
        <el-table-column
            prop="birthday"
            width="100"
            label="出生日期">
        </el-table-column>
        <el-table-column
            prop="idCard"
            width="150"
            label="身份证号码">
        </el-table-column>
        <el-table-column
            prop="wedlock"
            width="70"
            label="婚姻状况">
        </el-table-column>
        <el-table-column
            prop="nation.name"
            width="50"
            label="民族">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            width="80"
            label="籍贯">
        </el-table-column>
        <el-table-column
            prop="politicsstatus.name"
            label="政治面貌">
        </el-table-column>
        <el-table-column
            prop="email"
            width="180"
            label="电子邮件">
        </el-table-column>
        <el-table-column
            prop="phone"
            width="100"
            label="电话号码">
        </el-table-column>
        <el-table-column
            prop="address"
            width="220"
            label="联系地址">
        </el-table-column>
        <el-table-column
            prop="department.name"
            width="100"
            label="所属部门">
        </el-table-column>
        <el-table-column
            prop="position.name"
            width="100"
            label="职位">
        </el-table-column>
        <el-table-column
            prop="joblevel.name"
            width="100"
            label="职称">
        </el-table-column>
        <el-table-column
            prop="engageForm"
            width="100"
            label="聘用形式">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            width="100"
            label="入职日期">
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            width="100"
            label="转正日期">
        </el-table-column>
        <el-table-column
            prop="beginContract"
            width="100"
            label="合同起始日期">
        </el-table-column>
        <el-table-column
            prop="endContract"
            width="100"
            label="合同终止日期">
        </el-table-column>
        <el-table-column
            width="70"
            label="合同期限">
          <template slot-scope="scope">
            {{ scope.row.contractTerm }}年
          </template>
        </el-table-column>
        <el-table-column
            prop="school"
            width="110"
            label="毕业院校">
        </el-table-column>
        <el-table-column
            prop="specialty"
            width="150"
            label="专业">
        </el-table-column>
        <el-table-column
            prop="tiptopDegree"
            width="85"
            label="最高学历">
        </el-table-column>
        <el-table-column
            label="操作"
            width="200"
            fixed="right">

          <template slot-scope="scope">
            <el-button style="padding: 3px" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>
            <el-button style="padding: 3px" size="mini" type="danger" @click="delEmp(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    分页-->
    <div>
      <el-pagination
          style="display: flex;justify-content: flex-start"
          background
          layout="sizes, prev, pager, next, jumper, ->, total, slot	"
          @current-change="currentChange"
          :current-page.sync="page"
          @size-change="sizeChange"
          :total="total">
      </el-pagination>
    </div>
    <!--    添加和修改对话框-->
    <div>
      <el-dialog width="80%" :title=title :visible.sync="dialogFormVisible">
        <div>
          <el-form ref="form" :rules="rules" :model="emp" label-width="80px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="姓名:" prop="name">
                  <el-input style="width: 150px" v-model="emp.name" prefix-icon="el-icon-edit-outline"
                            placeholder="请输入员工姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="性别:" prop="gender">
                  <el-radio-group v-model="emp.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出生日期" prop="birthday">
                  <el-date-picker
                      style="width: 150px;"
                      v-model="emp.birthday"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                    prop="politicId"
                    label="政治面貌">
                  <el-select v-model="emp.politicId" clearable placeholder="请选择">
                    <el-option
                        v-for="item in politicsstatus"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item
                    prop="nationId"
                    label="民族:">
                  <el-select style="width: 150px" v-model="emp.nationId" clearable placeholder="请选择民族">
                    <el-option
                        v-for="item in nation"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                    label="籍贯:"
                    prop="nativePlace">
                  <el-input placeholder="请输入籍贯" prefix-icon="el-icon-edit-outline" v-model="emp.nativePlace"
                            style="width: 120px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                    label="电子邮箱:"
                    label-width="100px"
                    prop="email">
                  <el-input placeholder="请输入电子邮箱" prefix-icon="el-icon-message" v-model="emp.email"
                            style="width: 150px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                    label="联系地址:"
                    label-width="100px"
                    prop="address">
                  <el-input placeholder="请输入联系地址" prefix-icon="el-icon-position" v-model="emp.address"
                            style="width: 200px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item
                    prop="posId"
                    label="职位">
                  <el-select style="width: 150px" v-model="emp.posId" clearable placeholder="请选择职位">
                    <el-option
                        v-for="item in position"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                    prop="jobLevelId"
                    label="职称:">
                  <el-select style="width: 130px" v-model="emp.jobLevelId" clearable placeholder="请选择职称">
                    <el-option
                        v-for="item in joblevel"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                    prop="departmentId"
                    label-width="100px"
                    label="所属部门:">
                  <el-cascader
                      ref="depts"
                      v-model="departmentId"
                      :options="departments"
                      :props="{ checkStrictly: true, label:'name', value: 'id'}"
                      :show-all-levels="false"
                      style="width: 150px"
                      @change="handleChange"
                      clearable>
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                    label="电话号码:"
                    label-width="100px"
                    prop="phone">
                  <el-input placeholder="请输入电话号码" prefix-icon="el-icon-phone-outline" v-model="emp.phone"
                            style="width: 150px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item
                    label="工号:"
                    prop="workId">
                  <el-input placeholder="请输入工号" prefix-icon="el-icon-lock" disabled v-model="emp.workId"
                            style="width: 150px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                    prop="tiptopDegree"
                    label="学历">
                  <el-select style="width: 120px" v-model="emp.tiptopDegree" clearable placeholder="最高学历">
                    <el-option
                        v-for="item in tiptopDegree"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                    label="毕业院校:"
                    label-width="100px"
                    prop="school">
                  <el-input placeholder="请输入毕业院校" prefix-icon="el-icon-phone-outline" v-model="emp.school"
                            style="width: 150px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                    label="专业名称:"
                    label-width="100px"
                    prop="specialty">
                  <el-input placeholder="请输入专业名称" prefix-icon="el-icon-phone-outline" v-model="emp.specialty"
                            style="width: 150px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="入职日期" prop="beginDate">
                  <el-date-picker
                      style="width: 130px;"
                      v-model="emp.beginDate"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="转正日期" prop="conversionTime">
                  <el-date-picker
                      style="width: 130px;"
                      v-model="emp.conversionTime"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="120px" label="合同起始日期" prop="beginContract">
                  <el-date-picker
                      style="width: 130px;"
                      v-model="emp.beginContract"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="120px" label="合同终止日期" prop="endContract">
                  <el-date-picker
                      style="width: 130px;"
                      value-format="yyyy-MM-dd"
                      v-model="emp.endContract"
                      type="date"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                    label="身份证号码:"
                    label-width="100px"
                    prop="idCard">
                  <el-input placeholder="请输入身份证号码" prefix-icon="el-icon-phone-outline" v-model="emp.idCard"
                            style="width: 150px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="聘用形式:">
                  <el-radio-group v-model="emp.engageForm">
                    <el-radio label="劳动合同">劳动合同</el-radio>
                    <el-radio label="劳务合同">劳务合同</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别:">
                  <el-radio-group v-model="emp.wedlock">
                    <el-radio label="已婚">已婚</el-radio>
                    <el-radio label="未婚">未婚</el-radio>
                    <el-radio label="离异">离异</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="doAddOrUpdateEmp">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      advancedSearchFlag: false,
      searchValue: {
        name: null,
        nationId: null,
        politicId: null,
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: null,
        workId: null,
        date: null
      },
      showAdvanceSearch: false,
      importDialog: false,
      departmentId: 1,
      title: '',
      dialogFormVisible: false,
      name: '',
      loading: false,
      total: 10,
      page: 1,
      size: 10,
      emps: [],
      emp: {
        name: '赵琳浩2',
        gender: '男',
        birthday: '1993-03-04',
        idCard: '610122199303041456',
        wedlock: '未婚',
        nationId: 1,
        nativePlace: '陕西',
        politicId: 3,
        email: 'zhao@qq.com',
        phone: '15698887795',
        address: '陕西省西安市莲湖区',
        departmentId: 1,
        jobLevelId: 12,
        posId: 33,
        engageForm: '劳动合同',
        tiptopDegree: '博士',
        specialty: '电子工程',
        school: '哈尔滨理工大学',
        beginDate: '2018-01-01',
        workState: '在职',
        workId: '00000013',
        contractTerm: 3.5,
        conversionTime: '2018-04-01',
        notWorkDate: null,
        beginContract: '2018-01-01',
        endContract: '2021-07-14',
        workAge: null,
      },
      departments: [],
      politicsstatus: [],
      nation: [],
      joblevel: [],
      position: [],
      tiptopDegree: ['本科', '硕士', '博士', '大专', '高中', '初中', '小学', '其他'],
      rules: {
        name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        gender: [{required: true, message: '请完善性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        idCard: [{required: true, message: '请输入身份证', trigger: 'blur'},
          {
            patter: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
            message: '身份证号码格式不正确', trigger: 'blur'
          }],
        wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
        nationId: [{required: true, message: '请输入民族', trigger: 'blur'}],
        nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
        politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱', trigger: 'blur'}, {
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur'
        }],
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'},
          {
            patter: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
            message: '手机号码格式不正确', trigger: 'blur'
          }],
        address: [{required: true, message: '请输入地址信息', trigger: 'blur'}],
        departmentId: [{required: true, message: '请输入部门', trigger: 'blur'}],
        jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
        posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
        engageForm: [{required: true, message: '请输入聘用形式', trigger: 'blur'}],
        tiptopDegree: [{required: true, message: '请输入最高学历', trigger: 'blur'}],
        specialty: [{required: true, message: '请输入所属专业', trigger: 'blur'}],
        school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
        beginDate: [{required: true, message: '请输入入职日期', trigger: 'blur'}],
        workId: [{required: true, message: '请输入工号', trigger: 'blur'}],
        conversionTime: [{required: true, message: '请输入转正日期', trigger: 'blur'}],
        beginContract: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
        endContract: [{required: true, message: '请输入合同终止日期', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
    this.initPositions();
    this.initDepts()

  },
  methods: {
    doAdvancedSearch(){
      this.page =1
      this.initEmps('advanced')
    },
    AdvancedSearchDeptChange() {
      let leaf = this.$refs.searchDepts.getCheckedNodes(true);
      if (leaf == null) {
        this.searchValue.departmentId = null;
        return;
      }
      this.searchValue.departmentId = leaf[0].value;
    },
    importError() {
      this.importDialog = false;
      this.$message.error("导入失败！")
    },
    importSuccess() {
      //关闭弹窗
      this.importDialog = false;
      this.$message.success("导入成功！")
      //刷新emps
      this.initEmps();
    },
    exportData() {
      window.open('/employee/basic/export/', '_parent')
    },
    showEditDialog(data) {
      this.emp = {}
      this.title = '修改员工信息'
      this.emp = data;
      this.departmentId = data.department.id
      this.getAddDialogWorkId()
      this.dialogFormVisible = true;
    },
    delEmp(data) {
      this.$confirm('此操作将永久删除该员工【' + data.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/employee/basic/' + data.id).then(resp => {
          if (resp) {
            this.initEmps();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    doAddOrUpdateEmp() {
      //修改
      if (this.emp.id) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.putRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogFormVisible = false;
                this.initEmps();
              }
            });
          }
        })

      } else {//添加
        this.$refs.form.validate(valid => {
          if (valid) {
            this.postRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogFormVisible = false;
                this.initEmps();
              }
            });
          }
        })
      }
    },

    handleChange() {
      let leaf = this.$refs.depts.getCheckedNodes(true);
      this.emp.departmentId = leaf[0].value;
    },
    initDepts() {
      this.getRequest("/employee/basic/dept/").then(resp => {
        if (resp) {
          this.departments = resp.data;
        }
      })
    },
    getAddDialogWorkId() {
      this.getRequest('/employee/basic/maxWorkId/').then(resp => {
        if (resp) {
          this.emp.workId = resp.data;
        }
      })
    },
    initPositions() {
      this.getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.position = resp.data;
        }
      })
    },
    initData() {
      if (!window.sessionStorage.getItem('politicsstatus')) {
        this.getRequest('/employee/basic/politics/').then(resp => {
          if (resp) {
            this.politicsstatus = resp.data;
            window.sessionStorage.setItem('politicsstatus', JSON.stringify(resp.data))
          }
        })
      } else {
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem('politicsstatus'));
      }
      if (!window.sessionStorage.getItem('nation')) {
        this.getRequest('/employee/basic/nations/').then(resp => {
          if (resp) {
            this.nation = resp.data;
            window.sessionStorage.setItem('nation', JSON.stringify(resp.data))
          }
        })
      } else {
        this.nation = JSON.parse(window.sessionStorage.getItem('nation'));
      }
      if (!window.sessionStorage.getItem('joblevel')) {
        this.getRequest('/employee/basic/joblevels/').then(resp => {
          if (resp) {
            this.joblevel = resp.data;
            window.sessionStorage.setItem('joblevel', JSON.stringify(resp.data))
          }
        })
      } else {
        this.joblevel = JSON.parse(window.sessionStorage.getItem('joblevel'));
      }
    },
    showAddDialog() {
      // this.emp = {};
      this.title = '添加员工'
      this.getAddDialogWorkId()
      this.dialogFormVisible = true
    },
    sizeChange(currentSize) {
      this.size = currentSize
      if (this.advancedSearchFlag) {
        this.initEmps('advanced');
      } else {
        this.initEmps();
      }
    },
    currentChange(currentPage) {
      this.page = currentPage;
      if (this.advancedSearchFlag) {
        this.initEmps('advanced');
      } else {
        this.initEmps();
      }
    },
    initEmps(type) {
      this.loading = true;
      let url = '/employee/basic/?page=' + this.page + '&size=' + this.size
      //做出判断，避免后端服务器收到null字符串
      if (this.searchValue.name && this.searchValue.name != '') {
        url += '&name=' + this.searchValue.name;
      }
      if (type != null && type == 'advanced') {      //高级搜索
        this.advancedSearchFlag = true;
        if (this.searchValue.date) {
          url += '&date=' + this.searchValue.date
        }
        if (this.searchValue.nationId) {
          url += '&nationId=' + this.searchValue.nationId
        }
        if (this.searchValue.departmentId) {
          url += '&departmentId=' + this.searchValue.departmentId
        }
        if (this.searchValue.jobLevelId) {
          url += '&jobLevelId=' + this.searchValue.jobLevelId
        }
        if (this.searchValue.politicId) {
          url += '&politicId=' + this.searchValue.politicId
        }
        if (this.searchValue.posId) {
          url += '&posId=' + this.searchValue.posId
        }
        if (this.searchValue.engageForm && this.searchValue.engageForm != '') {
          url += '&engageForm=' + this.searchValue.engageForm
        }
        if (this.searchValue.workId) {
          url += '&workId=' + this.searchValue.workId
        }

      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.emps = resp.data.records
          this.total = resp.data.total
        }
      })
    },
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all .5s ease;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
{
  transform: translateX(10px);
  opacity: 0;
}
</style>