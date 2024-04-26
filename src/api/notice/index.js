import request from "../../util/request";
import { getToken, setToken, removeToken } from "../../util/auth";

// 发布公告
export function Savenotice(data) {
    return request({
        method: "post",
        url: "/admin/notice/save",
        headers: {
            token: getToken(),
        },
        data: data
    });
}

// 查询公告
export function Listnotice(data) {
    return request({
        method: "get",
        url: "/admin/notice/list",
        headers: {
            token: getToken(),
        },
        params:{
            page:data.page,
            pageSize:data.pageSize
        }
    });
}

// 查询公告id
export function ListnoticeID(id) {
    return request({
        method: "get",
        url: "/customer/notice/list",
        headers: {
            token: getToken(),
        },
        params:{
            id:id
        }
    });
}

// 删除公告
export function delnotice(id) {
    return request({
        method: "delete",
        url: `/admin/notice/delete/${id}`,
        headers: {
            token: getToken(),
        },
    });
}

