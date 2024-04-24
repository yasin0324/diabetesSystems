import request from "../../util/request";
import { getToken } from "../../util/auth";

const token = getToken();

// 获取所有发送信息用户的id的信息
export function getChatUsers() {
    return request({
        method: "get",
        url: "/chat/list/chat/user",
        headers: {
            token: token,
        },
    });
}
// 获取与聊天用户的聊天信息
export function getChats(id) {
    return request({
        method: "get",
        url: `/chat/list/chatMsg/${id}`,
        headers: {
            token: token,
        },
    });
}
// 删除聊天记录
export function deletemsg(id) {
    return request({
        method: "delete",
        url: `/chat/delete/chatMsg/${id}`,
        headers: {
            token: token,
        },
    });
}
// 修改消息已读
export function updatemsg(id) {
    return request({
        method: "put",
        url: `/chat/update/chatMsgIsRead/${id}`,
        headers: {
            token: token,
        },
    });
}
