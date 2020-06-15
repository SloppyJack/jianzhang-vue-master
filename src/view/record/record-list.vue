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
        :expand-row-keys="expends"
        height="600"
        v-loading="loading"
      >
        <el-table-column type="expand">
              <template slot-scope="props">
                <div>
                  <el-form label-width="100px">
                    <el-form-item label="花费类别">
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
          <el-button @click="handleClick(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
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
      expends: []
    }
  },
  async created() {
    this.loading = true
    await this.getRecords()
    this.loading = false
  },
  methods: {
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
    handleClick(obj) {
      console.log(obj)
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
    rowClick() {},
    onQueryChange(val) {
      this.$message(`${val}`)
    },
    // eslint-disable-next-line
    expandChange(row,expandedRows) {
      // 当用户对某一行展开或者关闭的时候会触发该事件
      console.log(expandedRows)
      /*expandedRows.forEach((item,index) => {
        this.recordTypes.push(item)
      })*/
      console.log(this.expends)
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
