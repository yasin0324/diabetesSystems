<template>
    <div class="login">
        <el-form
            ref="loginRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
        >
            <h3 class="title">控糖宝后台管理系统</h3>
            <el-form-item prop="userName">
                <el-input
                    v-model="loginForm.userName"
                    type="text"
                    size="large"
                    auto-complete="off"
                    placeholder="用户名"
                >
                    <template #prefix
                        ><el-icon class="el-input__icon input-icon"
                            ><UserFilled /></el-icon></template
                ></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    v-model="loginForm.password"
                    type="password"
                    size="large"
                    auto-complete="off"
                    placeholder="密码"
                    @keyup.enter="submitForm"
                >
                    <template #prefix
                        ><el-icon><Lock /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item style="width: 100%">
                <el-button
                    :loading="loading"
                    size="large"
                    type="primary"
                    color="#736ffe"
                    round
                    plain
                    style="width: 100%"
                    @click.prevent="submitForm"
                >
                    <span v-if="!loading">登录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            v-model="captchaEnabled"
            width="31vh"
            class="captchaDialog"
            show-close="false"
        >
            <captcha-slider @close-dialog="finishCheck"></captcha-slider>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { loginUserName } from "../../api/login/index";
import { setToken } from "../../util/auth";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

const loginRef = ref();
const loginForm = ref({
    userName: "",
    password: "",
    rememberMe: false,
});

const loginRules = {
    userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(false);
const submitForm = async () => {
    if (!loginRef.value) return;
    await loginRef.value.validate((valid) => {
        if (valid) {
            captchaEnabled.value = true;
        } else {
            return false;
        }
    });
};
// 滑块验证码校验成功
const finishCheck = () => {
    captchaEnabled.value = false;
    loginByUserName();
};
// 登录
const loginByUserName = () => {
    loginUserName(loginForm.value)
        .then((res) => {
            console.log(res.data);
            if (res.data.role === "管理员") {
                setToken(res.data.token);
                ElMessage.success("登录成功");
                setTimeout(() => {
                    router.push("/home");
                }, 800);
            } else {
                ElMessage.error("权限不足，无法登录");
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
</script>

<style lang="less" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
    background-image: url("../../common/image/background1.png");
    background-size: cover;
    .login-form {
        border-radius: 3vh;
        background-color: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        width: 40vh;
        padding: 2.5vh 2.5vh 0.5vh 2.5vh;
        .el-input {
            --el-input-border-radius: 2vh;
            height: 5vh;
            input {
                height: 4vh;
            }
            .input-icon {
                height: 4vh;
                width: 2vh;
                margin-left: 0;
            }
        }
        .title {
            margin: 0px auto 30px auto;
            text-align: center;
            color: #707070;
        }
    }
}
:deep(.el-dialog) {
    background: transparent;
    box-shadow: none;
    margin: 25vh auto;
}
:deep(.el-dialog__header) {
    padding-bottom: 0;
}
</style>
