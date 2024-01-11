<template>
  <div v-loading="loading">
    <div style="display: flex;justify-content: space-between">
      <el-button icon="el-icon-plus" type="primary" @click="showAddDialog">添加工资账套</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initSalSob"></el-button>
    </div>
    <el-dialog
        :title="dialogName"
        :visible.sync="addDialogView"
        width="50%"
        :before-close="handleClose">
      <div style="height: 300px;display: flex;align-items: center">
        <el-steps style="margin-right: 150px" direction="vertical" :active="active" finish-status="success">
          <el-step :title="itemName" v-for="(itemName,index) in salItemName" :key="index"></el-step>
        </el-steps>
        <el-tag style="margin-right: 10px">{{ salItemName[active] + ':' }}</el-tag>
        <el-input v-model="salObj[key]" v-show="index==active" style="width: 200px" @keydown.enter.native="next"
                  v-for="(val,key,index) in salObj" :key="index" :placeholder="'请输入'+salItemName[index]"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="prev" :disabled="active==0">上一步</el-button>
    <el-button type="primary" @click="next">{{ this.active == 10 ? '完成' : '下一步' }}</el-button>
  </span>
    </el-dialog>
    <div style="margin-top: 10px">
      <el-table :data="salSob" stripe border>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="name" label="账套名称" width="120"></el-table-column>
        <el-table-column prop="basicSalary" label="基本工资" width="80"></el-table-column>
        <el-table-column prop="trafficSalary" label="交通补助" width="80"></el-table-column>
        <el-table-column prop="lunchSalary" label="午餐补助" width="80"></el-table-column>
        <el-table-column prop="bonus" label="奖金" width="80"></el-table-column>
        <el-table-column prop="createDate" label="启用时间" width="100"></el-table-column>
        <el-table-column label="养老金" align="center">
          <el-table-column prop="pensionper" label="比率" width="80"></el-table-column>
          <el-table-column prop="pensionBase" label="基数" width="80"></el-table-column>
        </el-table-column>
        <el-table-column label="医疗保险" align="center">
          <el-table-column prop="medicalper" label="比率" width="80"></el-table-column>
          <el-table-column prop="medicalBase" label="基数" width="80"></el-table-column>
        </el-table-column>
        <el-table-column label="公积金" align="center">
          <el-table-column prop="accumulationFundper" label="比率" width="80"></el-table-column>
          <el-table-column prop="accumulationFundBase" label="基数" width="80"></el-table-column>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="doDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalSob",
  data() {
    return {
      loading: false,
      dialogName: '',
      active: 0,
      salSob: [],
      addDialogView: false,
      salItemName: [
        '基本工资',
        '交通补助',
        '午餐补助',
        '奖金',
        '养老金比率',
        '养老金基数',
        '医疗保险比率',
        '医疗保险基数',
        '公积金比率',
        '公积金基数',
        '账套名称'
      ],
      salObj: {
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionper: 0,
        pensionBase: 0,
        medicalper: 0,
        medicalBase: 0,
        accumulationFundper: 0,
        accumulationFundBase: 0,
        name: '',
        id: -1
      }
    }
  },
  mounted() {
    this.initSalSob();
  },
  methods: {
    showEditDialog(data) {
      this.active=0;
      this.dialogName = '修改工资账套'
      this.addDialogView = true;
      this.salObj.basicSalary = data.basicSalary;
      this.salObj.trafficSalary = data.trafficSalary;
      this.salObj.lunchSalary = data.lunchSalary;
      this.salObj.bonus = data.bonus;
      this.salObj.pensionper = data.pensionper;
      this.salObj.pensionBase = data.pensionBase;
      this.salObj.medicalper = data.medicalper;
      this.salObj.medicalBase = data.medicalBase;
      this.salObj.accumulationFundper = data.accumulationFundper;
      this.salObj.accumulationFundBase = data.accumulationFundBase;
      this.salObj.name = data.name;
      this.salObj.id = data.id

    },
    doDelete(data) {
      this.$confirm('此操作将永久删除该【' + data.name + '】账套, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/salary/sob/' + data.id).then(resp => {
          if (resp) {
            this.initSalSob();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleClose() {
      this.addDialogView = false;
    },
    prev() {
      if (this.active > 0) {
        this.active--;
      }
    },
    next() {
      if (this.active++ >= 10) {
        if (this.salObj.id) {
          this.putRequest('/salary/sob/',this.salObj).then(resp => {
            if (resp) {
              this.initSalSob();
              this.addDialogView = false;
            }
          })
        } else {
          this.postRequest('/salary/sob/', this.salObj).then(resp => {
            if (resp) {
              this.initSalSob();
              this.addDialogView = false;
            }
          })
          return;
        }
      }


    },
    showAddDialog() {
      this.dialogName = '添加工资账套'
      this.salObj = {
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionper: 0,
        pensionBase: 0,
        medicalper: 0,
        medicalBase: 0,
        accumulationFundper: 0,
        accumulationFundBase: 0,
        name: ''
      };
      this.active = 0;
      this.addDialogView = true;
    },
    initSalSob() {
        this.loading = true;
      this.getRequest('/salary/sob/').then(resp => {
      this.loading = false;
        if (resp) {
          this.salSob = resp.data
        }
      })
    }
  },
}
</script>

<style scoped>

</style>