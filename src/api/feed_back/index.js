import request from "../../util/request";
import { getToken, setToken, removeToken } from "../../util/auth";

// 查询反馈信息
export function SaveFeed_back(data) {
    return request({
        method: "get",
        url: "/admin/feed_back/list/all",
        headers: {
            token: getToken(),
        },
        params:{
            page:data.page,
            pageSize:data.pageSize
        }
    });
}