<!-- 首页 -->
<template>
    <div>
        <sg-navbar></sg-navbar>
        <div class="container">
            <el-row  :gutter="30">
                <el-col :sm="24" :md="16" style="transition:all .5s ease-out;margin-bottom:30px;">
                    <sg-articlelist></sg-articlelist>
                </el-col>
                <el-col :sm="24"  :md="8" >
                    <sg-rightlist></sg-rightlist>
                </el-col>
            </el-row>
        </div>
      <!--底部footer-->
      <sg-footer class="index-foot"></sg-footer>
    </div>
</template>

<script>
import header from '../components/header.vue'
import articlelist from '../components/articlelist.vue'
import rightlist from '../components/rightlist.vue'
import footer from "../components/footer";
    export default {
        name:'Home',
        data() { //选项 / 数据
            return {
            }
        },
        methods: { //事件处理器

        },
        components: { //定义组件
            'sg-navbar':header,
            'sg-articlelist':articlelist,
            'sg-rightlist':rightlist,
            'sg-footer': footer,
        },
        created() { //生命周期函数

        }
    }
</script>

<style>
.index-foot {
  background-color: #333333;
  color: white!important;
  opacity: 0.9;
}
</style>
