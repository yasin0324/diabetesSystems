<template>
    <div class="login">
        <el-form
            ref="registerRef"
            style="min-width: 300px;"
            :model="registerForm"
            :rules="registerRules"
            class="login-form"
        >
            <h3 class="title">管理员注册</h3>
            <el-form-item prop="nickName">
                <el-input
                    v-model="registerForm.nickName"
                    type="text"
                    size="large"
                    auto-complete="off"
                    placeholder="昵称"
                    style="flex: 1;"
                >
                    <template #prefix
                        ><el-icon class="el-input__icon input-icon"
                            ><UserFilled /></el-icon></template
                ></el-input>
            </el-form-item>
            <el-form-item prop="mobile">
                <el-input
                    v-model="registerForm.mobile"
                    type="text"
                    size="large"
                    auto-complete="off"
                    placeholder="手机号"
                    style="flex: 1;"
                >
                    <template #prefix
                        ><el-icon><Iphone /></el-icon></template
                ></el-input>
            </el-form-item>
            <el-form-item prop="smsCode">
                <el-input
                    v-model="registerForm.smsCode"
                    type="text"
                    size="large"
                    auto-complete="off"
                    placeholder="验证码"
                    style="flex: 1;"
                >
                </el-input>
                <el-button
                    type="success"
                    color="#736ffe" 
                    round 
                    plain
                    :disabled="isCountingDown"
                    @click="getSmsCode"
                    style="margin-left: 10px;"
                    >{{
                        isCountingDown ? `${countdown}s` : "获 取"
                    }}</el-button
                >
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    v-model="registerForm.password"
                    type="password"
                    size="large"
                    auto-complete="off"
                    placeholder="密码"
                    style="flex: 1;"
                >
                    <template #prefix
                        ><el-icon><Lock /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input
                    v-model="confirmPassword"
                    type="password"
                    size="large"
                    auto-complete="off"
                    placeholder="再次确认密码"
                    style="flex: 1;"
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
                    <span v-if="!loading">注册</span>
                    <span v-else>注 册 中...</span>
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
import { registerUser,smsCodeGet } from "../../api/register/index"
import { ElMessage } from "element-plus";


const resgisterRef = ref();
const registerForm = ref({
    nickName: "",
    mobile: "",
    password: "",
    smsCode: "",
    name: "管理员",
    gender: "男",
});

const confirmPassword = ref('')
// 验证密码是否一致
const validateConfirmPassword = (rule, value, callback) => {
    if (confirmPassword.value === registerForm.value.password) {
        callback();
    } else {
        callback(new Error("两次输入密码不一致"));
    }
};

// 注册表单校验
const registerRules = ref({
    nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
    mobile: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
        },
    ],
    smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        {
            min: 6,
            max: 18,
            message: "密码长度在 6 到 18 个字符",
            trigger: "blur",
        },
    ],
    confirmPassword: [
        { required: true, message: "请确认密码", trigger: "blur" },
        { validator: validateConfirmPassword, trigger: "blur" },
    ],
});

// 获取验证码倒计时
const countdown = ref(60);
const isCountingDown = ref(false);
// 获取手机验证码
function getSmsCode() {
    if(registerForm.value.mobile === ''){
        ElMessage({
            message:"请先填写手机号",
            type:"error"
        })
        return;
    }
    // console.log(registerForm.value.mobile)
    smsCodeGet(registerForm.value.mobile)
        .then((res) => {
            console.log(res);
            isCountingDown.value = true;
            const timer = setInterval(() => {
                if (countdown.value > 0) {
                    countdown.value--;
                    console.log(countdown.value);
                } else {
                    isCountingDown.value = false;
                    countdown.value = 60;
                    clearInterval(timer);
                }
            }, 1000);
        })
        .catch((err) => {
            console.log(err);
        });
}


const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(false);
const submitForm = async () => {
    if (!resgisterRef.value) return;
    await resgisterRef.value.validate((valid) => {
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
    registerByMobile();
};
// 注册
function registerByMobile() {
    registerUser(registerForm.value)
        .then((res) => {
            isSwitched.value = true;
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
}
</script>

<style lang="less" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
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
