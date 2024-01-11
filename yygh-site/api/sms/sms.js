import request from '@/utils/request'

const api_name = `/api/msm`

export default {
  sendCode(email) {
    return request({
      url: `${api_name}/send/${email}`,
      method: `get`
    })
  }
}
