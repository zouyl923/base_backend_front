import axios from 'axios';
import { ElNotification } from 'element-plus';
import router from '@/router';
import Auth from './auth';
let auth = new Auth()
//例如axios对象的create方法，去创建axios实例
let baseURL = import.meta.env.VITE_APP_BASE_API
let request = axios.create({
    //配置接口地址
    baseURL: baseURL,
    //配置超时时间
    timeout: 6000,
});
//拦截器-请求之前
request.interceptors.request.use(config => {
    //config配置对象,headers属性请求头，给服务器端公共参数
    config.headers['Authorization'] = auth.getToken();
    config.headers['refreshToken'] = auth.getRefreshToken();
    config.headers['Csrf'] = auth.getCsrfToken();
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    return config;
});

//拦截器-请求之后
request.interceptors.response.use(
    response => {
        //成功回调
        // 对响应数据做点什么
        if (response.data.code == 10102) {
            //清除cache
            localStorage.clear();
            ElNotification.error('登录失效，请重新登录！');
            setTimeout(function () {
                //跳转
                router.push({
                    path: '/',
                });
                window.location.reload();
            }, 500);
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
