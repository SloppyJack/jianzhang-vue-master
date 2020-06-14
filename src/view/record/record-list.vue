<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
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
        :operate="operate"
        @row-click="rowClick"
        @expand-change="expandChange"
        height="600"
        v-loading="loading"
      >
        <el-table-column type="expand">
          <el-collapse-transition>
            <div v-show="expendFlag">
              <el-form label-position="left">
                <el-form-item label="商品名称">
                  <span>1</span>
                </el-form-item>
                <el-form-item label="所属店铺">
                  <span>1</span>
                </el-form-item>
                <el-form-item label="商品 ID">
                  <span>1</span>
                </el-form-item>
                <el-form-item label="店铺 ID">
                  <span>1</span>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-transition>
              <!--<template slot-scope="props">
                <el-collapse-transition>
                <div v-show="expendFlag">
                  <el-form label-position="left">
                    <el-form-item label="商品名称">
                      <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="所属店铺">
                      <span>{{ props.row.shop }}</span>
                    </el-form-item>
                    <el-form-item label="商品 ID">
                      <span>{{ props.row.id }}</span>
                    </el-form-item>
                    <el-form-item label="店铺 ID">
                      <span>{{ props.row.shopId }}</span>
                    </el-form-item>
                    <el-form-item label="商品分类">
                      <span>{{ props.row.category }}</span>
                    </el-form-item>
                    <el-form-item label="店铺地址">
                      <span>{{ props.row.address }}</span>
                    </el-form-item>
                    <el-form-item label="商品描述">
                      <span>{{ props.row.desc }}</span>
                    </el-form-item>
                  </el-form>
                </div>
                </el-collapse-transition>
              </template>
-->
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

    <!-- 编辑页面 -->
    <book-modify v-else @editClose="editClose" :editBookID="editBookID"></book-modify>
  </div>
</template>

<script>
import record from '@/model/record'
import LinSearch from '@/component/base/search/lin-search'
import BookModify from '../book/book-modify'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

export default {
  components: {
    BookModify,
    LinSearch,
    CollapseTransition
  },
  data() {
    return {
      tableColumn: [
        { prop: 'amount', label: '金额', width: '200' },
        { prop: 'spend_category.name', label: '花费类别', width: '200' },
        { prop: 'occur_time', label: '交易时间', width: '250' },
        { prop: 'remarks', label: '备注', width: '250' }
      ],
      tableData: [],
      operate: [],
      showEdit: false,
      editBookID: 1,
      expendFlag: false
    }
  },
  async created() {
    this.loading = true
    await this.getRecords()
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除图书',
      },
    ]
    this.loading = false
  },
  methods: {
    async getRecords() {
      try {
        const records = await record.getRecords()
        console.log(records)
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
    handleEdit(val) {
      console.log('val', val)
      this.showEdit = true
      this.editBookID = val.row.id
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
    editClose() {
      this.showEdit = false
      this.getBooks()
    },
    onQueryChange(val) {
      this.$message(`${val}`)
    },
    // eslint-disable-next-line
    expandChange(row,expandedRows) {
      // 当用户对某一行展开或者关闭的时候会触发该事件
      this.expendFlag = !this.expendFlag
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
