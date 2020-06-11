// eslint-disable-next-line
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class SpendCategory {
  // 获取全部的花费类别列表
  getSpendCategoryList() {
    return _axios({
      method: 'get',
      url: 'v1/spendCategory',
      handleError: true,
    })
  }

  // 根据记录类型获取花费类别
  async getSpendCategory(recordTypeId) {
    const res = await get(`v1/spendCategory/${recordTypeId}`)
    return res
  }
}

export default new SpendCategory()
