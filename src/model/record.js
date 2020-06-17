/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Record {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async createRecord(data) {
    return _axios({
      method: 'post',
      url: 'v1/record',
      data,
    })
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getBook(id) {
    const res = await get(`v1/book/${id}`)
    return res
  }

  async editBook(id, info) {
    const res = await put(`v1/book/${id}`, info)
    return res
  }

  async delectBook(id) {
    const res = await _delete(`v1/book/${id}`)
    return res
  }

  async getRecords() {
    return _axios({
      method: 'get',
      url: 'v1/record/list',
      handleError: true,
    })
  }

  editRecord(id, info) {
    const res = put(`v1/record/${id}`, info)
    return res
  }
}
export default new Record()
