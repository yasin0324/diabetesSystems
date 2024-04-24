<template>
    <div class="main">
        <div class="mainContent">
            <div class="userCard" v-for="item in userLists">
                <div class="userNickName">{{ item.nickName }}</div>
                <div class="userInfo1">
                    <div class="userAvatar">
                        <img
                            :src="item.avatar"
                            style="width: 5vh; height: 5vh; border-radius: 50%"
                        />
                    </div>
                    <div class="userName">
                        <div class="label">姓名：</div>
                        <div class="content">
                            {{ item.name ? item.name : "空" }}
                        </div>
                    </div>
                    <div class="userGender">
                        <div class="label">性别：</div>
                        <div class="content">
                            {{ item.gender ? item.gender : "空" }}
                        </div>
                    </div>
                </div>
                <div class="userInfo2">
                    <div class="mobile">
                        <div class="label">手机号：</div>
                        <div class="content">
                            {{ item.mobile ? item.mobile : "空" }}
                        </div>
                    </div>
                </div>
                <div class="userInfo3">
                    <div class="createTime">
                        <div class="time">创建时间:{{ item.createTime }}</div>
                    </div>
                </div>
                <div class="footerButton">
                    <div class="diss">
                        <el-button
                            v-if="item.status === 1"
                            round
                            @click="setDisabled(item)"
                            >禁 用 账 号</el-button
                        >
                        <el-button
                            v-if="item.status === 0"
                            round
                            class="disabled"
                            @click="setRestart(item)"
                            >启 用 账 号</el-button
                        >
                    </div>
                    <div class="moreInfo">
                        <el-button round @click="checkInfo(item.userId)"
                            >查 看 详 细</el-button
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="mainFooter">
            <el-pagination
                :page-size="pageSize"
                @current-change="handleCurrentPage"
                :total="datalength"
                v-model:current-page="page"
                layout="pre,pager,next"
            ></el-pagination>
        </div>
        <el-dialog align-center v-model="dialogVisible" title="用户详细信息">
            <el-descriptions
                :title="userInfo.nickName"
                border
                size="large"
                class="userMoreInfo"
            >
                <el-descriptions-item label="姓名">{{
                    userInfo.name ? userInfo.name : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{
                    userInfo.gender ? userInfo.gender : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="年龄">{{
                    userInfo.age ? userInfo.age : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="身高(cm)">{{
                    userInfo.height ? userInfo.height : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="体重(kg)">{{
                    userInfo.weight ? userInfo.weight : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="生日">{{
                    userInfo.birthday ? userInfo.birthday : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="职业">{{
                    userInfo.occupation ? userInfo.occupation : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="地址">{{
                    userInfo.address ? userInfo.address : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{
                    userInfo.mobile ? userInfo.mobile : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="个人简介">{{
                    userInfo.introduction ? userInfo.introduction : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="用户ID">{{
                    userInfo.userId ? userInfo.userId : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="用户名">{{
                    userInfo.userName ? userInfo.userName : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="创建账号时间">{{
                    userInfo.createTime ? userInfo.createTime : "空"
                }}</el-descriptions-item>
                <el-descriptions-item label="最新编辑时间">{{
                    userInfo.updateTime ? userInfo.updateTime : "空"
                }}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
    getUserData,
    disableAccount,
    restart,
    getOneUser,
} from "../../api/userData/index";
import { ElMessage } from "element-plus";

const page = ref(1);
const pageSize = ref(10);
const datalength = ref(20);
const userLists = ref([]);
const dialogVisible = ref(false);
// 切换分页
const handleCurrentPage = () => {
    let data = {
        page: page.value,
        pageSize: pageSize.value,
    };
    getUserData(data)
        .then((res) => {
            userLists.value = res.data.customerInformVOList;
            datalength.value = res.data.total;
        })
        .catch((err) => {
            console.log(err);
        });
};
// 查看单个用户信息
const userInfo = ref({});
const getUserInfo = (id) => {
    getOneUser(id)
        .then((res) => {
            userInfo.value = res.data;
        })
        .catch((err) => {
            console.log(err);
        });
};
const checkInfo = (id) => {
    userInfo.value = {};
    getUserInfo(id);
    dialogVisible.value = true;
};
// 禁用用户账号
const setDisabled = (user) => {
    disableAccount(user.userId)
        .then((res) => {
            ElMessage.success(res.msg);
            handleCurrentPage();
        })
        .catch((err) => {
            console.log(err);
        });
};
// 启用用户账号
const setRestart = (user) => {
    restart(user.userId)
        .then((res) => {
            ElMessage.success(res.msg);
            handleCurrentPage();
        })
        .catch((err) => {
            console.log(err);
        });
};

// 获取所有数据
onMounted(() => {
    handleCurrentPage();
});
</script>

<style lang="less" scoped>
.main {
    position: relative;
    height: 100%;
    .mainContent {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: start;
        padding-left: 4vh;
        .userCard {
            flex-shrink: 0;
            background-color: #f0f2fd;
            height: 24vh;
            width: 33vh;
            margin-bottom: 2vh;
            border-radius: 4vh;
            margin-right: 4vh;
            display: flex;
            flex-direction: column;
            position: relative;
            .label {
                font-weight: 500;
                height: 2vh;
                line-height: 2vh;
            }
            .content {
                font-weight: 100;
                height: 2vh;
                line-height: 2vh;
            }
            .userNickName {
                font-size: 2.4vh;
                font-weight: bold;
                margin-top: 1vh;
                margin-left: 9vh;
            }
            .userInfo1 {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 1vh;
                .userAvatar,
                .userName,
                .userGender {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-left: 2vh;
                }
            }
            .userInfo2 {
                margin-top: 1vh;
                margin-left: 6.9vh;
                .mobile {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-left: 2vh;
                }
            }
            .userInfo3 {
                margin-top: 2vh;
                .createTime {
                    margin-left: 2vh;
                    .time {
                        font-size: 1.8vh;
                        font-weight: bold;
                        color: grey;
                    }
                }
            }
            .footerButton {
                display: flex;
                flex-direction: row;
                bottom: 1vh;
                .diss {
                    position: absolute;
                    left: 1vh;
                    bottom: 1vh;
                    .disabled {
                        background-color: grey;
                    }
                }
                .moreInfo {
                    position: absolute;
                    right: 1vh;
                    bottom: 1vh;
                }
            }
        }
    }
    .mainFooter {
        position: absolute;
        right: 3vh;
        bottom: 0vh;
    }
    :deep(.el-dialog) {
        border-radius: 3ch;
    }
    .el-button {
        background-color: #aeaed1;
        color: #fff;
        font-weight: bold;
        width: 15vh;
    }
}
</style>
