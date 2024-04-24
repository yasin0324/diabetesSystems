import request from '../../util/request'
import { getToken, removeToken } from "../../util/auth";

// 获取用户信息
export function getUserName() {
    return request({
        method: "get",
        url: "/customer/list",
        headers: {
            token: getToken(),
        },
    });
}

// 修改用户信息
export function putUserName(dataValue) {
    return request({
        method: "put",
        url: "/customer/update",
        headers: {
            token: getToken(),
        },
        data:dataValue
    });
}

// 添加用户账号密码关联账号
export function putAddUserConnection(dataValue) {
    return request({
        method: "put",
        url: "/customer/associated/addByUserName",
        headers: {
            token: getToken(),
        },
        data:dataValue
    });
}

// 添加用户手机号关联账号
export function putAddMobileConnection(dataValue) {
    return request({
        method: "put",
        url: "/customer/associated/addByMobile",
        headers: {
            token: getToken(),
            mobile:dataValue.mobile,
            smsCode:dataValue.smsCode
        },
    });
}

// 删除关联账号
export function putDelUserConnection(user2Id) {
    return request({
        method: "put",
        url: `/customer/associated/delete/${user2Id}`,
        headers: {
            token: getToken(),
        },
    });
}

// 切换关联账号
export function postUserConnection(associatedAccount) {
    return request({
        method: "post",
        url: `/customer/associated/exchange/${associatedAccount}`,
        headers: {
            token: getToken(),
        },
    });
}

// 修改密码
export function putUserpass(dataValue) {
    return request({
        method: "put",
        url: "/user/password/update2",
        headers: {
            token: getToken(),
        },
        data:dataValue
    });
}

// 修改手机号
export function putUsermobile(dataValue) {
    return request({
        method: "put",
        url: "/user/mobile/update",
        headers: {
            token: getToken(),
            mobile: dataValue.mobile,
            smsCode :dataValue.smsCode
        },
    });
}

// 获取手机验证码
export function smsCodeGet(data) {
    return request({
        method: "get",
        url: "/common/code/mobile",
        params: {
            mobile: data,
        },
    });
}

// 获取所有用户信息
export function getallUser(data) {
    return request({
        method: "get",
        url: "/admin/page/customer",
        headers: {
            token: getToken(),
        },
        params: {
            page:data.page,
            pageSize:data.pageSize
        },
    });
}

// 查询单个用户信息
export function getOneUser(userId){
    return request({
        method: "get",
        url: `/customer/list/${userId}`,
        headers: {
            token: getToken(),
        },
    })
}

// 手机号验证码登录
export function loginMobile(data) {
    return request({
        method: "post",
        url: "/user/login/mobile",
        headers: {
            mobile: data.mobile,
            smsCode: data.smsCode,
        },
    });
}

// 用户名密码登录
export function loginUsername(data) {
    return request({
        method: "post",
        url: "/user/login/username",
        data: {
            userName: data.userName,
            password: data.password,
        },
    });
}

// 获取用户信息
export function getUser(data) {
    return request({
        method: "get",
        url: "/customer/list",
        headers: {
            token: data,
        },
    });
}