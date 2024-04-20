import request from "../../util/request";

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
