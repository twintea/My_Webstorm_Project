import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { history, Link } from '@umijs/max';
import {TOKEN_NAME} from "@/constant";
// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

// const addToken =(url: string, options: RequestConfig) => {  // 此处为拦截器，每次发送请求之前判断能否取到token
//     const tokenHeader = {
//       'ttapidata': `${localStorage.getItem(TOKEN_NAME)}`,
//     };
//
//     return {
//       url: `${url}`,
//       options: { ...options, interceptors:true, headers: tokenHeader },
//     };
// };



/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  baseURL: 'http://localhost:7529',
  withCredentials: true,


  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      // const url = config?.url?.concat('?token = 123');
      const url = config?.url;
      return { ...config, url };
    }
    // addToken
  ],

// 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      if (data.code !== 0) {
        message.error(data.message).then(r => {});
        //如果报未登录错误码，重定向到登录页
        if (data.code ===40100){
          history.push('/user/login');
        }
      }

      return response;
    },
  ],

};
