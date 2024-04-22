import request from "../../util/request";
import { getToken } from "../../util/auth";

const token = getToken();

// 获取用户新增量和累积量
export function getUserNum() {
    return request({
        method: "get",
        url: "/admin/customer/cumulant",
        headers: {
            token: token,
        },
    });
}
