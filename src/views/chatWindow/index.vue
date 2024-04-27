<template>
    <div class="main">
        <div class="chatLists">
            <div class="listHeader">近期消息</div>
            <div class="listContent">
                <div
                    class="listItem"
                    v-for="(item, index) in chaters"
                    :key="index"
                    :class="{ 'is-focus': selectID === item.sysUser.id }"
                    @click="choseChat(item, index)"
                >
                    <el-badge :value="item.notReadNum" :show-zero="false">
                        <div class="avatar">
                            <img
                                :src="item.sysUser.avatar"
                                style="
                                    width: 7vh;
                                    border-radius: 2vh;
                                    margin-right: 1vh;
                                "
                            /></div
                    ></el-badge>
                    <div class="info">
                        <div class="nickname">
                            {{ item.sysUser.nickName }}
                        </div>
                        <div
                            class="lastMsg"
                            style="
                                font-size: 1.6vh;
                                color: #9999b3;
                                margin-top: 1vh;
                            "
                        >
                            {{ item.lastMsg }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chatWindow">
            <div class="chatHeader">
                <div
                    class="status"
                    :style="
                        serviceStatus
                            ? {
                                  width: '2vh',
                                  height: '2vh',
                                  borderRadius: '50%',
                                  backgroundColor: '#a0a5a8',
                                  marginRight: '1vh',
                              }
                            : {
                                  width: '2vh',
                                  height: '2vh',
                                  borderRadius: '50%',
                                  backgroundColor: '#00ff00',
                                  marginRight: '1vh',
                              }
                    "
                ></div>
                <div class="content">{{ received.nickName }}</div>
            </div>
            <div class="chatMain" ref="chatContent">
                <div
                    v-for="item in allChats"
                    :class="
                        item.sendId === admin.userId ? 'chatRight' : 'chatLeft'
                    "
                >
                    <div class="avatar">
                        <img
                            :src="
                                item.sendId === admin.userId
                                    ? admin.avatar
                                    : received.avatar
                            "
                            style="
                                width: 7vh;
                                height: 7vh;
                                border-radius: 50%;
                                border: 1px solid black;
                            "
                        />
                    </div>
                    <div class="msg_outer">
                        <div class="msg_inner">{{ item.msg }}</div>
                    </div>
                </div>
            </div>
            <div class="chatFooter">
                <el-input
                    v-model="mess"
                    maxlength="500"
                    show-word-limit
                    type="textarea"
                    resize="none"
                    :autosize="{ minRows: 6, maxRows: 6 }"
                    :disabled="serviceStatus"
                >
                </el-input>
                <div class="footer">
                    <el-button
                        type="primary"
                        @click="send"
                        :disabled="serviceStatus"
                        >发送</el-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive, watch } from "vue";
import { getInfo } from "../../api/login";
import { getOneUser } from "../../api/userData";
import {
    getChatUsers,
    getChats,
    deletemsg,
    updatemsg,
} from "../../api/chatWindow";

const admin = ref({});
const websocket = ref(null);
const userId = ref(9);
const mess = ref("");

const getAdminInfo = () => {
    getInfo()
        .then((res) => {
            admin.value = res.data;
            userId.value = res.data.userId;
        })
        .catch((err) => {
            console.log(err);
        });
};

if ("WebSocket" in window) {
    websocket.value = new WebSocket(
        "ws://124.221.104.7:12007/ws/" + userId.value
    );
} else {
    alert("浏览器不支持WebSocket");
}

websocket.value.onerror = function () {
    console.log("连接失败");
};

websocket.value.onopen = function () {
    console.log("连接成功");
};

websocket.value.onmessage = function (event) {
    console.log(event.data);
    if (event.data !== "webSocket连接成功！") {
        getChatUsers()
            .then((res) => {
                chaters.value = res.data;
                chaters.value.map((item) => {
                    if (item.sysUser.id === received.value.userId) {
                        item.notReadNum = 0;
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
        serviceStatus.value = false;
        if (event.data === "发送失败，接收者已下线！") {
            serviceStatus.value = true;
        }
        getChatMsg(received.value.userId);
    }
};

websocket.value.onclose = function () {
    console.log("连接关闭");
};

window.onbeforeunload = function () {
    websocket.value.close();
};

const serviceStatus = ref(false);

// 发送消息
const send = () => {
    let data = {
        msg: mess.value,
        receiveId: received.value.userId,
    };
    websocket.value.send(JSON.stringify(data));
    mess.value = "";
    getChatMsg(received.value.userId);
};

// 关闭连接
const close = () => {
    websocket.value.close();
};

// 获取对话者列表
const chaters = ref([]);
const getChaters = () => {
    getChatUsers()
        .then((res) => {
            chaters.value = res.data;
            choseChat(res.data[0]);
        })
        .catch((err) => {
            console.log(err);
        });
};
// 选择对话对象
const selectID = ref(0);
const choseChat = (chater) => {
    serviceStatus.value = false;
    selectID.value = chater.sysUser.id;
    chater.notReadNum = 0;
    let data = {
        msg: "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTQwNDkzNzAsInVzZXJJZCI6IjkifQ.wDyeTdDkki-dDG_NsqZ126e4X8FVNJ3axCDLrFGcTe0123",
        receiveId: chater.sysUser.id,
    };
    setTimeout(() => {
        websocket.value.send(JSON.stringify(data));
    }, 500);
    getChatMsgs(chater.sysUser.id);
};
// 聊天内容
const allChats = ref([]);
const received = ref({});
const getChatMsgs = (id) => {
    getOneUser(id)
        .then((res) => {
            received.value = res.data;
        })
        .catch((err) => {
            console.log(err);
        });
    getChats(id)
        .then((res) => {
            allChats.value = res.data.reverse();
            res.data.map((item) => {
                updatemsg(item.id);
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
// 获取聊天内容
const getChatMsg = (id) => {
    getChats(id)
        .then((res) => {
            console.log(res.data);
            allChats.value = res.data.reverse();
            res.data.map((item) => {
                updatemsg(item.id);
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

const chatContent = ref(null);
watch(
    () => allChats.value.length,
    () => {
        nextTick(() => {
            scrollBottom();
        });
    }
);
const scrollBottom = () => {
    chatContent.value.scrollTop = chatContent.value.scrollHeight;
};

onMounted(() => {
    getAdminInfo();
    getChaters();
});
</script>

<style lang="less" scoped>
.main {
    height: 107%;
    width: 103.5%;
    position: relative;
    left: -3vh;
    top: -3vh;
    display: flex;
    flex-direction: row;
    background-color: #f4f5f7;
    .chatLists {
        width: 20%;
        height: 100%;
        background-color: #fff;

        .listHeader {
            height: 10%;
            width: 100%;
            border-bottom: 1px solid #d8d8d8;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .listContent {
            overflow: scroll;
            overflow-x: hidden;
            scrollbar-color: #fff #ecf0f3;
            scrollbar-width: thin;
            height: 90%;
            .listItem {
                height: 12%;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: start;
                padding-left: 3vh;
                :deep(.el-badge) {
                    .el-badge__content {
                        margin-top: 1vh;
                        margin-right: 2vh;
                    }
                }
            }
            .is-focus {
                background-color: #f4f5f7;
            }
            .listItem:hover {
                background-color: #f4f5f7;
                cursor: pointer;
            }
        }
    }
    .chatWindow {
        height: 100%;
        width: 80%;
        border-left: 1px solid #d8d8d8;
        .chatHeader {
            height: 10%;
            width: 100%;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3vh;
            font-weight: bold;
            border-bottom: 1px solid #d8d8d8;
        }
        .chatMain {
            height: 50vh;
            width: 100%;
            background-color: #f4f5f7;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-color: #fff #ecf0f3;
            scrollbar-width: thin;
            padding-bottom: 3vh;

            .chatLeft {
                display: flex;
                flex-direction: row;
                align-items: start;
                margin-left: 2vh;
                margin-top: 2vh;
                .msg_outer {
                    margin-top: 2vh;
                    margin-left: 1vh;
                    .msg_inner {
                        word-wrap: break-word;
                        background-color: #e6e9ff;
                        padding: 2vh;
                        border-top-right-radius: 2vh;
                        border-bottom-right-radius: 2vh;
                        border-bottom-left-radius: 2vh;
                    }
                }
            }
            .chatRight {
                display: flex;
                flex-direction: row-reverse;
                align-items: start;
                margin-right: 2vh;
                margin-top: 2vh;
                .msg_outer {
                    margin-top: 2vh;
                    margin-right: 1vh;
                    .msg_inner {
                        word-wrap: break-word;
                        background-color: #e6e9ff;
                        padding: 2vh;
                        border-top-left-radius: 2vh;
                        border-bottom-right-radius: 2vh;
                        border-bottom-left-radius: 2vh;
                    }
                }
            }
        }
        .chatFooter {
            height: 30%;
            width: 100%;
            border-top: 1px solid #d8d8d8;
            background-color: #f4f5f7;
            display: flex;
            flex-direction: column;
            position: relative;
            :deep(.el-textarea) {
                --el-input-hover-border-color: none;
                --el-input-focus-border-color: none;
                .el-textarea__inner {
                    box-shadow: none;
                }
            }
            .footer {
                .el-button {
                    position: absolute;
                    bottom: 3vh;
                    right: 3vh;
                }
                height: 100%;
                background-color: #fff;
            }
        }
    }
}
</style>
