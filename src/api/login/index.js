import request from "../../util/request";
import { getToken, setToken, removeToken } from "../../util/auth";

const token = getToken();

// 用户名密码登录
export function loginUserName(data) {
    return request({
        method: "post",
        url: "/user/login/username",
        data: {
            userName: data.userName,
            password: data.password,
        },
    });
}

// 用户手机号登录
export function loginPhone(data) {
    return request({
        method: "post",
        url: "/user/login/mobile",
        headers: {
            mobile: data.mobile,
            smsCode: data.smsCode,
        },
    });
}

// 获取短信验证码
export function getSmsCode(data) {
    return request({
        method: "get",
        url: "/common/code/mobile",
        params: {
            mobile: data,
        },
    });
}

// 退出登录
export function logout() {
    return request({
        method: "post",
        url: "/user/logout1",
        headers: {
            token: token,
        },
    });
}

// 获取用户信息
export function getInfo() {
    return request({
        method: "get",
        url: "/customer/list",
        headers: {
            token: token,
        },
    });
}
