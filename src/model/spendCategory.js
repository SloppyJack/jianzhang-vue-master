// eslint-disable-next-line
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class SpendCategory {
  getSpendCategoryList() {
    return _axios({
      method: 'get',
      url: 'v1/spendCategory',
      handleError: true,
    })
  }
}

export default new SpendCategory()
