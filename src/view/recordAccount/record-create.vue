<template>
    <div class="lin-container">
        <div class="lin-title">记一笔</div>
        <div class="lin-wrap-ui">
            <el-card style="margin-bottom:50px;">
                <div slot="header"><span>支出与收入</span></div>
                <el-row>
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

                        </el-tab-pane>
                    </el-tabs>
                </el-row>
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
    }
  }

}
</script>

<style lang="scss" scoped>
    @import '../../assets/style/index';
    @import '../../assets/style/container';
</style>
