// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addUser POST /api/admin/user/add */
export async function addUserUsingPOST(body: API.UserAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponselong>('/api/admin/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** bannedAccount GET /api/admin/user/banned/account */
export async function bannedAccountUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.bannedAccountUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/api/admin/user/banned/account', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** deleteUser POST /api/admin/user/delete */
export async function deleteUserUsingPOST(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/admin/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listUserManageVO GET /api/admin/user/list */
export async function listUserManageVOUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listUserManageVOUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListUserManageVO>('/api/admin/user/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listUserByPage POST /api/admin/user/list/page */
export async function listUserByPageUsingPOST(
  body: API.UserQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageUserManageVO>('/api/admin/user/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** restoredAccount GET /api/admin/user/restored/account */
export async function restoredAccountUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.restoredAccountUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/api/admin/user/restored/account', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getUserManageDetail GET /api/admin/user/userInterface/usage/detail */
export async function getUserManageDetailUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManageDetailUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUserManageDetailVO>('/api/admin/user/userInterface/usage/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
