<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="header-left"><p class="title">记账明细</p></div>
        <div class="header-right">
          <lin-search @query="onQueryChange" placeholder="请输入备注" />
          <div style="margin-left:30px">
            <el-button type="primary" @click="dialogTableVisible = !dialogTableVisible">列操作</el-button>
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
        <el-table-column v-for="(item,index) in tableColumn" :key="index" :label="item.label"
                         :prop="item.prop" :min-width="item.width">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
              <el-row :gutter="20">
                  <transition name="el-zoom-in-top">
                      <!-- 使用@click.stop防止点击事件冒泡 -->
                      <el-button v-show="!showSaveFlag[scope.row.id]" @click.stop="editRow(scope.row)" type="primary" size="small" round>编辑</el-button>
                  </transition>
                  <transition name="el-zoom-in-bottom">
                      <el-button v-show="showSaveFlag[scope.row.id]" @click.stop="editRow(scope.row)"
                                 type="success" size="small" :loading="saveLoading[scope.row.id]" round>保存</el-button>
                  </transition>
                  <el-button type="danger" size="small" round>删除</el-button>
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
      tableColumn: [
        { prop: 'amount', label: '金额', width: '200' },
        { prop: 'spend_category.name', label: '花费类别', width: '200' },
        { prop: 'occur_time', label: '交易时间', width: '250' },
        { prop: 'remarks', label: '备注', width: '250' }
      ],
      tableData: [],
      form: {
        amount: '',
        spend_category: '',
        occur_time: '',
        remarks: '',
      },
      showSaveFlag: [], // 此处使用数组
      saveLoading: [] // loading的状态也须使用数组
    }
  },
  async created() {
    this.loading = true
    await this.getRecords()
    this.loading = false
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
        console.log(row)
        try {
          // 开始保存
          await record.editRecord(row.id, this.form)
          this.$refs.refTable.toggleRowExpansion(row)
          this.$set(this.saveLoading, [row.id], false)
        } catch (e) {
          this.$set(this.saveLoading, [row.id], false)
          console.log(e)
        }
      } else {
        // 编辑按钮
        this.$refs.refTable.toggleRowExpansion(row)
      }
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await book.delectBook(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.getBooks()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
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
      // 给form赋值
      this.form.amount = row.amount
      this.form.spend_category = row.spend_category.id
      this.form.occur_time = row.occur_time
      this.form.remarks = row.remarks
      // 是否显示某一行的保存按钮
      this.showSaveFlag[row.id] = !this.showSaveFlag[row.id]
    },
    judgeIsTrue(val) {
      return val === true
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
