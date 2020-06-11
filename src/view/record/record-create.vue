<template>
    <div class="lin-container">
        <div class="lin-title">记一笔</div>
        <div class="lin-wrap-ui">
            <el-card style="margin-bottom:50px;" v-loading="card_loading">
                <div slot="header"><span>支出与收入</span></div>
                <el-form>
                    <el-row>
                        <el-col :lg="16" :md="20" :sm="24" :xs="24">
                            <el-form :model="form" :rules="rules" ref="form" label-width="100px" @submit.native.prevent>
                                <el-tabs v-model="form.record_type"  @tab-click="handleClick">
                                    <el-tab-pane v-for="recordType in recordTypes" :key="recordType.code" :label="recordType.name" :name="recordType.id">
                                        <el-form-item label="类型" prop="spend_category">
                                            <el-select size="medium" :loading="select_loading" @focus="getSpendCategory"
                                                        v-model="form.spend_category" placeholder="请选择" style="width: 100%;">
                                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="金额" prop="amount">
                                            <el-input-number v-model="form.amount" size="min" :min="0" :precision="2" :step="5" style="width: 100%;"></el-input-number>
                                        </el-form-item>
                                    </el-tab-pane>
                                </el-tabs>
                                <el-form-item label="发生时间" prop="occur_time">
                                    <el-date-picker v-model="form.occur_time" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions" style="width: 100%;">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="备注" prop="remarks">
                                    <el-input placeholder="备注内容" size="medium" suffix-icon="el-icon-edit" v-model="form.remarks" style="width: 100%;">
                                    </el-input>
                                </el-form-item>
                                <el-form-item class="submit">
                                    <el-button type="primary" @click="submitForm('form')">保 存</el-button>
                                    <el-button @click="resetForm('form')">重 置</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
import record from '@/model/record'
import recordType from '@/model/recordType'
import spendCategory from '@/model/spendCategory'

const DEFAULT_RECORD_TYPE = '2'

export default {
  data() {
    const checkAmount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('金额不能为空'))
      } else {
        callback()
      }
    }
    return {
      recordTypes: [],
      options: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      form: {
        record_type: DEFAULT_RECORD_TYPE,
        spend_category: '',
        amount: '',
        occur_time: '',
        remarks: ''
      },
      rules: {
        spend_category: [
          { required: true, message: '请选择收入或支出类型', trigger: 'change' }
        ],
        amount: [
          { validator: checkAmount, trigger: 'change' }
        ],
        occurTime: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      card_loading: false,
      select_loading: false
    }
  },
  created() {
    this.getRecordTypes()
  },
  methods: {
    handleClick(obj) {
      this.$message(`您现在是在 ${obj.$options.propsData.label}`)
      this.resetForm('form')
    },
    handleCommand(command) {
      this.$message(`点击了 ${command}`)
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true // loading状态
          try {
            console.log(this.form)
            const res = await record.createRecord(this.form)
            this.loading = false
            this.$message.success(`${res.message}`)
            if (res.code < window.MAX_SUCCESS_CODE) {
              this.resetForm(formName)
            }
          } catch (error) {
            this.loading = false
            console.log(`记账异常，msg：${error}`)
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取记录的类型列表
    async getRecordTypes() {
      this.card_loading = true // loading状态
      try {
        const res = await recordType.getRecordTypes()
        // eslint-disable-next-line
        res.forEach((item,index) => {
          // 此处将后端返回的id转为String
          item.id = item.id.toString()
          this.recordTypes.push(item)
        })
        this.card_loading = false
      } catch (error) {
        this.card_loading = false
        console.log(`获取记账类型异常，msg：${error}`)
      }
    },
    // 获取花费类型列表
    async getSpendCategory() {
      this.select_loading = true
      try {
        const res = await spendCategory.getSpendCategory(this.form.record_type)
        this.select_loading = false
        // 搜索前情况options数组
        this.options = []
        // eslint-disable-next-line
        res.forEach((item,index) => {
          // 此处将后端返回的id转为String
          item.id = item.id.toString()
          const val = item.id.toString()
          const label = item.name.toString()
          // eslint-disable-next-line
          const option = { 'value': val, 'label': label }
          this.options.push(option)
        })
      } catch (error) {
        this.select_loading = false
        console.log(`获取记账类型异常，msg：${error}`)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
    @import '../../assets/style/index';
    @import '../../assets/style/container';
</style>
