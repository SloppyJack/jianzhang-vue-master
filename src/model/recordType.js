/* eslint-disable class-methods-use-this */
import _axios from '@/lin/plugin/axios'

class RecordType {
  getRecordTypes() {
    return _axios({
      method: 'get',
      url: 'v1/recordType',
      handleError: true,
    })
  }
}

export default new RecordType()
