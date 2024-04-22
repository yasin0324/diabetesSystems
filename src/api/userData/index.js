import request from "../../util/request";
import { getToken } from "../../util/auth";

const token = getToken();

// 分页查询用户信息
export function getUserData(data) {
    return request({
        method: "get",
        url: "/admin/page/customer",
        headers: {
            token: token,
        },
        params: {
            page: data.page,
            pageSize: data.pageSize,
        },
    });
}

// 禁用账号
export function disableAccount(id) {
    return request({
        method: "put",
        url: `/admin/forbidden/customer/${id}`,
        headers: {
            token: token,
        },
    });
}

// 启用账号
export function restart(id) {
    return request({
        method: "put",
        url: `/admin/restart/customer/${id}`,
        headers: {
            token: token,
        },
    });
}

// 获取单个客户信息
export function getOneUser(id) {
    return request({
        method: "get",
        url: `/customer/list/${id}`,
        headers: {
            token: token,
        },
    });
}
