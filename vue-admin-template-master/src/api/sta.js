import request from '@/utils/request'

const api_name = '/admin/order'

export default {

    getCountMap(searchObj) {
        return request({
            url: `${api_name}/statistics/orderCount`,
            method: 'get',
            params: searchObj
        })
    }
}
