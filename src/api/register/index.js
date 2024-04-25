import request from '../../util/request'
import { getToken, removeToken } from "../../util/auth";

// 用户注册
export function registerUser(data) {
    return request({
        method: "post",
        url: "/user/register",
        headers: {
            smsCode: data.smsCode,
            mobile: data.mobile,
        },
        data: {
            nickName: data.nickName,
            password: data.password,
            name: data.name,
            gender: data.gender,
            roleName: "管理员",
        },
    });
}

// 获取短信验证码
export function smsCodeGet(data) {
    return request({
        method: "get",
        url: "/common/code/mobile",
        params: {
            mobile: data,
        },
    });
}
