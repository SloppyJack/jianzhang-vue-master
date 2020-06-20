<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="header-left"><p class="title">记账明细</p></div>
        <div class="header-right">
          <lin-search @query="onQueryChange" placeholder="请输入备注" />
          <div style="margin-left:30px">
              <router-link to="/record/add">
                  <el-button type="primary">去记账</el-button>
              </router-link>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        @row-click="rowClick"
        @expand-change="expandChange"
        ref="refTable"
        height="600"
        v-loading="loading"
      >
        <el-table-column type="expand">
              <template slot-scope="props">
                <div>
                  <el-form :model="form" label-width="100px">
                    <el-form-item label="花费类别" prop="spend_category">
                      <el-input placeholder="备注内容" size="medium" suffix-icon="el-icon-edit"
                                v-model="props.row.spend_category.name" :disabled="true" style="width: 50%;">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="金额">
                      <el-input-number v-model="props.row.amount" size="min" :min="0"
                                       :precision="2" :step="5" style="width: 50%;"></el-input-number>
                    </el-form-item>
                    <el-form-item label="发生时间">
                      <el-input placeholder="在何时消费的~" size="medium" suffix-icon="el-icon-edit"
                                v-model="props.row.occur_time" :disabled="true" style="width: 50%;">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                      <el-input placeholder="在何时消费的~" size="medium" suffix-icon="el-icon-edit"
                                v-model="props.row.remarks" style="width: 50%;">
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </template>
        </el-table-column>
        <!--<el-table-column v-for="(item,index) in tableColumn" :key="index" :label="item.label"
                         :prop="item.prop" :min-width="item.width"
                         :filters="item.filters">
        </el-table-column>-->
        <el-table-column label="金额" prop="amount" :min-width="200"></el-table-column>
        <el-table-column label="花费类别" prop="spend_category.name" :filters="spendCategoryFilters" :min-width="200"></el-table-column>
        <el-table-column label="交易时间" prop="occur_time" :min-width="250"></el-table-column>
        <el-table-column label="备注" prop="remarks" :min-width="250"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
              <el-row :gutter="20">
                  <el-col :span="12">
                  <transition name="el-zoom-in-bottom">
                      <!-- 使用@click.stop防止点击事件冒泡 -->
                      <el-button v-show="!showSaveFlag[scope.row.id]" @click.stop="editRow(scope.row)" type="primary" size="small" round>编辑</el-button>
                  </transition>
                  <transition name="el-zoom-in-bottom">
                      <el-button style="margin-left: 0px" v-show="showSaveFlag[scope.row.id]" @click.stop="editRow(scope.row)"
                                 type="success" size="small" :loading="saveLoading[scope.row.id]" round>保存</el-button>
                  </transition>
                  </el-col>
                  <el-col :span="12">
                  <el-popconfirm
                          confirmButtonText='好的'
                          cancelButtonText='不用了'
                          icon="el-icon-info"
                          iconColor="red"
                          title="确定删除这一条记录吗？"
                          @onConfirm="handleDelete(scope.row.id)"
                  >
                      <el-button slot="reference" @click.stop="" type="danger" size="small" round>删除</el-button>
                  </el-popconfirm>
                  </el-col>
              </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import record from '@/model/record'
import LinSearch from '@/component/base/search/lin-search'

export default {
  components: {
    LinSearch
  },
  data() {
    return {
      loading: false,
      tableData: [],
      form: {
        amount: '',
        spend_category: '',
        occur_time: '',
        remarks: '',
      },
      showSaveFlag: [], // 此处使用数组
      saveLoading: [], // loading的状态也须使用数组
      spendCategoryFilters: []
    }
  },
  async created() {
    this.loading = true
    await this.getRecords()
    this.loading = false
    // 初始化类别的过滤器
    this.initSpendCategoryFileters()
  },
  methods: {
    // 获取记账列表
    async getRecords() {
      try {
        const records = await record.getRecords()
        this.tableData = records
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    // 编辑记账信息
    async editRow(row) {
      if (this.showSaveFlag[row.id]) {
        // 如果showSaveFlag为true时表示当前为保存按钮
        this.$set(this.saveLoading, [row.id], true)
        try {
          // 给form赋值
          this.form.amount = row.amount
          this.form.spend_category = row.spend_category.id
          this.form.occur_time = row.occur_time
          this.form.remarks = row.remarks
          // 开始保存
          const res = await record.editRecord(row.id, this.form)
          this.$refs.refTable.toggleRowExpansion(row)
          this.$set(this.saveLoading, [row.id], false)
          this.$message.success(`${res.message}`)
        } catch (e) {
          this.$set(this.saveLoading, [row.id], false)
          console.log(e)
        }
      } else {
        // 编辑按钮
        this.$refs.refTable.toggleRowExpansion(row)
      }
    },
    async handleDelete(id) {
      this.loading = true
      try {
        const res = await record.deleteRecord(id)
        this.$message.success(`${res.message}`)
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // eslint-disable-next-line
    rowClick(row, column, event) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    onQueryChange(val) {
      this.$message(`${val}`)
    },
    // eslint-disable-next-line
    expandChange(row, expandedRows) {
      // 是否显示某一行的保存按钮
      this.showSaveFlag[row.id] = !this.showSaveFlag[row.id]
    },
    initSpendCategoryFileters() {
      // eslint-disable-next-line
      this.tableData.forEach((item,index) => {
        this.spendCategoryFilters.push(
          // eslint-disable-next-line
          { 'text': item.spend_category.name, 'value': item.spend_category.id }
        )
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    border-bottom: 1px solid #dae1ed;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: $parent-title-color;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
