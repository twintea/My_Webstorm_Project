import request from '@/utils/request'
const api_name = `/admin/order`
export default {
  submitOrder(scheduleId, patientId) {
    return request({
      url: `${api_name}/submitOrder/${scheduleId}/${patientId}`,
      method: 'post'
    })
  },

  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  getStatusList() {
    return request({
      url: `${api_name}/getStatusList`,
      method: 'get'
    })
  },

  getOrderInfo(orderId) {
    return request({
      url: `${api_name}/getOrderInfo/${orderId}`,
      method: 'get'
    })
  },

  cancelOrder(orderId) {
    return request({
      url: `${api_name}/cancelOrder/${orderId}`,
      method: 'get'
    })
  }
}
