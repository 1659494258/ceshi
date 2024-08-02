import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  ElLoading,
  ElMessage,
} from 'element-plus';

let loading: any;
//正在请求的数量
let requestCount: number = 0
let user = JSON.parse(window.localStorage.getItem('user')) ? JSON.parse(window.localStorage.getItem('user')) : {}
const showLoading = () => {
  if (requestCount === 0 && !loading) {
    //加载中显示样式可以自行修改
    loading = ElLoading.service({
      text: "拼命加载中，请稍后...",
      background: 'rgba(0, 0, 0, 0.7)',
      spinner: 'el-icon-loading',
    })
  }
  requestCount++;
}
//隐藏loading
const hideLoading = () => {
  requestCount--
  if (requestCount == 0) {
    loading.close()
  }
}

export class Request {
  public static axiosInstance: AxiosInstance;
  public static init() {
    // 创建axios实例
    this.axiosInstance = axios.create({
      baseURL: '',
      // baseURL: '/config/',
      // baseURL: 'http://192.168.66.122:9202/config',
      timeout: 10000
    });
    // 初始化拦截器
    this.initInterceptors();
    return axios;
  }
  // 初始化拦截器
  public static initInterceptors() {
    // 设置post请求头
    this.axiosInstance.defaults.withCredentials = true;
    this.axiosInstance.defaults.headers.post["Content-Type"] = "application/json";
    this.axiosInstance.defaults.headers.post["User-id"] = user.userId;
    this.axiosInstance.defaults.headers.post["Org-id"] = user.orgId;
    /**
     * 请求拦截器
     * 每次请求前，如果存在token则在请求头中携带token
     */
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        showLoading()
        // const token = Vue.ls.get(ACCESS_TOKEN)
        // if (token) {
        //     config.headers['Authorization'] = 'Bearer ' + token
        // }
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // if (config.headers.isJwt) {
        const token = localStorage.getItem('ACCESS_TOKEN');
        // if (token) {
        //     config.headers.Authorization = token;
        // }
        // }
        return config;
      },
      (error: any) => {
        hideLoading()
        console.log(error);
      },
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      // 请求成功
      (response: AxiosResponse) => {

        if (response.headers) {
          // localStorage.setItem('id_token', response.headers.authorization);
          // console.log(response.headers)
        }
        // } else {
        //     if (response.data && response.data.token) {
        //         localStorage.setItem('id_token', response.data.token);
        //     }
        // }
        if (response.status === 200) {
          hideLoading()
          // return Promise.resolve(response.data);
          return response;
        } else {
          hideLoading()
          Request.errorHandle(response);
          // return Promise.reject(response.data);
          return response;
        }
      },
      // 请求失败
      (error: any) => {
        const { response } = error;
        if (response) {
          hideLoading()
          // 请求已发出，但是不在2xx的范围
          Request.errorHandle(response);

          return Promise.reject(response.data);
        } else {
          console.log('error', error)
          hideLoading()
          // 处理断网的情况
          // eg:请求超时或断网时，更新state的network状态
          // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
          // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
          ElMessage.error('网络连接异常,请稍后再试!');
        }
      });
  }

  /**
   * http握手错误
   * @param res 响应回调,根据不同响应进行不同操作
   */
  private static errorHandle(res: any) {
    console.log('res', res)
    // 状态码判断
    switch (res.status) {
      case 400:
        ElMessage.error('请求错误');
        break;
      case 401:
        ElMessage.error('请求错误');
        break;
      case 404:
        ElMessage.error('请求地址出错');
        break;
      case 408:
        ElMessage.error('请求超时');
        break;
      case 500:
        ElMessage.error(res.data.responseMessage);
        break;
      case 501:
        ElMessage.error('服务未实现!');
        break;
      case 502:
        ElMessage.error('网关错误!');
        break;
      case 503:
        ElMessage.error('服务不可用!');
        break;
      case 504:
        ElMessage.error('网关超时!');
        break;
      case 505:
        ElMessage.error('HTTP版本不受支持');
        break;
      default:
        ElMessage.error('请求失败');
    }
  }
}