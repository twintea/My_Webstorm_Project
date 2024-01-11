// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** uploadFile POST /api/file/upload */
export async function uploadFileUsingPOST(body: string, options?: { [key: string]: any }) {
  return request<API.BaseResponse>('/api/file/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
