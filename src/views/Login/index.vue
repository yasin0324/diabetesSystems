<template>
    <div class="login">
        <el-form
            ref="loginRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
        >
            <h3 class="title">控糖宝后台管理系统</h3>
            <el-form-item>
                <el-radio-group v-model="loginType" class="choseType">
                    <el-radio label="userName">用户名登录</el-radio>
                    <el-radio label="mobile">手机登录</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                prop="userName"
                v-if="loginType === 'userName'"
                class="form_item"
            >
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
            <el-form-item prop="password" v-if="loginType === 'userName'">
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
            <el-form-item prop="mobile" v-if="loginType === 'mobile'">
                <el-input
                    v-model="loginForm.mobile"
                    type="text"
                    size="large"
                    placeholder="手机号"
                >
                    <template #prefix>
                        <el-icon class="el-input__icon input-icon"
                            ><PhoneFilled
                        /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item
                prop="smsCode"
                v-if="loginType === 'mobile'"
                class="smsCode"
            >
                <el-input
                    v-model="loginForm.smsCode"
                    type="text"
                    size="large"
                    auto-complete="off"
                    placeholder="验证码"
                >
                    <template #prefix>
                        <el-icon><ChatLineRound /></el-icon>
                    </template>
                </el-input>
                <el-button
                    @click="getCode"
                    plain
                    color="#736ffe"
                    :disabled="isCountingDown"
                    >{{ isCountingDown ? `${countdown}s` : "获 取" }}</el-button
                >
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
import { loginUserName, getSmsCode, loginPhone } from "../../api/login/index";
import { setToken } from "../../util/auth";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

const loginRef = ref();
const loginForm = ref({
    userName: "",
    password: "",
    rememberMe: false,
    mobile: "",
    smsCode: "",
});

const loginRules = {
    userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    mobile: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
        },
    ],
    smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
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
    loginType.value === "userName"
        ? loginUserName(loginForm.value)
              .then((res) => {
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
              })
        : loginPhone(loginForm.value).then((res) => {
              if (res.data.role === "管理员") {
                  setToken(res.data.token);
                  ElMessage.success("登录成功");
                  setTimeout(() => {
                      router.push("/home");
                  }, 800);
              } else {
                  ElMessage.error("权限不足，无法登录");
              }
          });
};
const loginType = ref("userName");
const getCode = () => {
    getSmsCode(loginForm.value.mobile)
        .then((res) => {
            if (res.code === 200) {
                ElMessage.success(res.msg);
                isCountingDown.value = true;
                const timer = setInterval(() => {
                    if (countdown.value > 0) {
                        countdown.value--;
                    } else {
                        isCountingDown.value = false;
                        countdown.value = 60;
                        clearInterval(timer);
                    }
                }, 1000);
            } else {
                ElMessage.error(res.msg);
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
// 验证码倒计时
const countdown = ref(60);
const isCountingDown = ref(false);
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
        .choseType {
            margin: 0 auto;
        }
        .smsCode {
            :deep(.el-form-item__content) {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .el-input {
                    width: 70%;
                }
                .el-button {
                    width: 25%;
                    height: 100%;
                    border-radius: 1.5vh;
                    margin-right: 0vh;
                }
            }
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
:deep(.el-radio__input.is-checked + .el-radio__label) {
    color: #736ffe !important;
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
    background: #736ffe !important;
    border-color: #736ffe !important;
}
</style>
