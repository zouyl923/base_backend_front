import axios from 'axios';
import { ElNotification } from 'element-plus';
import router from '@/router';
import Auth from './auth';
let auth = new Auth();
//例如axios对象的create方法，去创建axios实例
let baseURL = import.meta.env.VITE_APP_BASE_API;
let request = axios.create({
    //配置接口地址
    baseURL: baseURL,
    //配置超时时间
    timeout: 6000,
});
//拦截器-请求之前
request.interceptors.request.use(config => {
    //config配置对象,headers属性请求头，给服务器端公共参数
    config.headers['Token'] = auth.getToken();
    config.headers['Refresh-Token'] = auth.getRefreshToken();
    config.headers['X-CSRF-Token'] = auth.getCsrfToken();
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    return config;
});

//拦截器-请求之后
request.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        switch (response.data.code) {
            case 0:
                //正常返回
                break;
            case -2:
            // token失效,refreshToken可以刷新
            // 可以额外处理，目前暂未处理
            case -3:
                // 双token失效
                // 防止登录失效多个请求重复提示问题
                let isNotify: boolean = Boolean(localStorage.getItem('login-fail'));
                if (isNotify == false) {
                    ElNotification.error('登录失效，请重新登录！');
                }
                localStorage.setItem('login-fail', '1');
                setTimeout(function () {
                    //跳转
                    router.push({
                        path: '/',
                    });
                    //清除cache
                    localStorage.clear();
                    window.location.reload();
                }, 1000);
                break;
            default:
                ElNotification.error(response.data.message);
        }
        return response.data;
    },
    error => {
        //失败回调：处理http网络错误
        let message = '未知错误！';
        let status = error.response.status;
        switch (status) {
            case 401:
                message = 'TOKEN过期';
                break;
            case 403:
                message = '无权访问';
                break;
            case 404:
                message = '请求地址错误';
                break;
            case 500:
                message = '服务器出现问题';
                break;
        }
        ElNotification({
            type: 'error',
            message: '[' + status + ']' + message,
        });
        return Promise.reject(error);
    },
);

export default request;
