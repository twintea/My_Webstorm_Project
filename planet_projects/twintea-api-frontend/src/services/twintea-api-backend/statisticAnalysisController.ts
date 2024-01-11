// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** showPopularInterface GET /api/interface/data_analysis/pop_interface */
export async function showPopularInterfaceUsingGET(options?: { [key: string]: any }) {
  return request<API.BaseResponseListPopInterfaceInfoVO>(
    '/api/interface/data_analysis/pop_interface',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
