<template>
    <div class="lin-container">
        <div class="lin-title">记一笔</div>
        <div class="lin-wrap-ui">
            <el-card style="margin-bottom:50px;">
                <div slot="header"><span>支出与收入</span></div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="支出" name="first">
                        <el-dropdown @command="handleCommand">
                            <span class="el-dropdown-link">
                            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                                <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                                <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                                <el-dropdown-item disabled >双皮奶</el-dropdown-item>
                                <el-dropdown-item divided command="蚵仔煎">蚵仔煎</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-tab-pane>
                    <el-tab-pane label="收入" name="second">
                        <el-row class="block-col-2">
                            <el-col :span="12">
                                <span class="demonstration">分类</span>
                                <el-dropdown @command="handleCommand">
                                    <el-button type="primary">请选择<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="工资">工资</el-dropdown-item>
                                        <el-dropdown-item command="兼职">兼职</el-dropdown-item>
                                        <el-dropdown-item command="理财">理财</el-dropdown-item>
                                        <el-dropdown-item command="其它">其它</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-col>
                        </el-row>
                        <el-collapse class="test" style="color:red;">
                            <el-collapse-item title="查看代码" name="2">
                                <div style="white-space: pre-wrap;"></div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'second'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleCommand(command) {
      this.$message('点击了 ' + command)
    }
  }

}
</script>

<style lang="scss" scoped>
    @import '../../assets/style/index';
    @import '../../assets/style/container';
</style>
