<template>
    <div>
        <div class="main">
            <div class="logo"></div>
            <div class="userInfo">
                <el-dropdown>
                    <el-avatar
                        class="userAvatar"
                        :size="50"
                        :src="userInfo.avatar"
                    ></el-avatar>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item
                                @click="toUser"
                                class="dropdownNickName"
                                >{{ userInfo.nickName }}</el-dropdown-item
                            >
                            <el-dropdown-item @click="toUser"
                                >个人中心</el-dropdown-item
                            >
                            <el-dropdown-item @click="toregister"
                                >管理员注册</el-dropdown-item
                            >
                            <el-dropdown-item @click="toLogout"
                                >退出登录</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getInfo, logout } from "../../api/login";
import { useRouter } from "vue-router";

const router = useRouter();

// 用户信息
const userInfo = ref({});
const getUserInfo = () => {
    getInfo()
        .then((res) => {
            userInfo.value = res.data;
            // if (res.code === 401) {
            //     localStorage.removeItem("token");
            //     router.push("/login");
            // }
        })
        .catch((err) => {
            console.log(err);
        });
};
// 退出登录
const toLogout = () => {
    logout()
        .then((res) => {
            localStorage.removeItem("token");
            router.push("/login");
        })
        .catch((err) => {
            console.log(err);
        });
};
// 跳转到个人中心
const toUser = () => {
    router.push("/home/userInfo");
};
// 跳转到管理员注册
const toregister = () =>{
    router.push("/home/register")
}

onMounted(() => {
    getUserInfo();
});
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 10vh;
    background-color: #f0f2fd;
    position: relative;
    display: flex;
    align-items: center;
    .logo {
        margin-left: 3vh;
        background-image: url("../../common/image/logo.png");
        height: 10vh;
        width: 20vh;
        background-size: cover;
    }
    .userInfo {
        position: absolute;
        right: 5vh;
    }
}
</style>
