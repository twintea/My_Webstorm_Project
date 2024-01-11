// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** loginCaptcha GET /api/captcha/gen/login */
export async function loginCaptchaUsingGET(options?: { [key: string]: any }) {
  return request<API.BaseResponseCaptchaVO>('/api/captcha/gen/login', {
    method: 'GET',
    ...(options || {}),
  });
}

/** registerCaptcha GET /api/captcha/gen/register */
export async function registerCaptchaUsingGET(options?: { [key: string]: any }) {
  return request<API.BaseResponseCaptchaVO>('/api/captcha/gen/register', {
    method: 'GET',
    ...(options || {}),
  });
}

/** resetAkSkCaptcha GET /api/captcha/gen/update/aksk */
export async function resetAkSkCaptchaUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.resetAkSkCaptchaUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseCaptchaVO>('/api/captcha/gen/update/aksk', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
