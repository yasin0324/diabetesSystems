import axios from "axios";

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: "/api",
    // 超时
    timeout: 10000,
});

// request拦截器
service.interceptors.request.use(
    (res) => {
        return res;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// response拦截器
service.interceptors.response.use(
    (res) => {
        return res.data;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default service;
