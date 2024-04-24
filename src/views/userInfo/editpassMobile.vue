<template>
    <div class="main">
          <div class="Banner">
              <div class="userNews">
                  <el-descriptions
                      class="margin-top"
                      title="账号相关"
                      size="large"
                      :column="3"
                      border
                  >
                      <el-descriptions-item>
                      <template #label>
                          <div class="cell-item">
                          <el-icon>
                              <user />
                          </el-icon>
                          账号
                          </div>
                      </template>
                      {{ UserNews.userName }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                      <template #label>
                          <div class="cell-item">
                          <el-icon><iphone /></el-icon>
                          手机号
                          </div>
                      </template>
                      {{ UserNews.mobile }}
                      <el-button type="success" plain :icon="Edit" circle @click="showPassORmobile(1)" />
                      </el-descriptions-item>
  
                  </el-descriptions>
              </div>
          </div>
          <!-- 修改密码 -->
          <div class="BannerPass" v-show="showUserPassword">
              <div class="userNews">
                  <div class="margin-top">
                      <h2>修改密码</h2>
                      <el-form
                          ref="UserPassForm"
                          style="max-width: 300px"
                          :model="UserPass"
                          status-icon
                          :rules="UserPassrules"
                          label-width="auto"
                          class="fromPass"
                      >
                          <el-form-item label="密码:" prop="password">
                              <el-input v-model="UserPass.password" placeholder="请输入密码"/>
                          </el-form-item>
                          <el-form-item label="再次输入密码:" prop="confirmPassword">
                              <el-input v-model="UserPass.confirmPassword" placeholder="请输入密码" />
                          </el-form-item>
                      </el-form>
                      <div>
                          <el-button type="info" plain size="large" @click="showPassORmobile(0)">修改手机号</el-button>
                          <el-button type="info" plain size="large" @click="backUsercenter">返回个人中心</el-button>
                          <el-button type="success" plain size="large" @click="submitPassForm">确认修改</el-button>
                      </div>
                  </div>
              </div>
          </div>
          <!-- 修改手机号 -->
          <div class="BannerPass" v-show="showUsermobile">
              <div class="userNews">
                  <div class="margin-top">
                      <h2>修改手机号</h2>
                      <el-form
                          ref="UsermobileForm"
                          style="max-width: 300px"
                          :model="UsermobileValue"
                          status-icon
                          :rules="Usermobilerules"
                          label-width="auto"
                          class="fromPass"
                      >
                          <el-form-item label="新手机号:" prop="mobile" >
                              <el-input v-model="UsermobileValue.mobile" placeholder="请输入手机号" style="flex: 1;" />
                          </el-form-item>
                          <el-form-item label="验证码:" prop="smsCode" style="display: flex; align-items: center;">
                              <el-input v-model="UsermobileValue.smsCode" placeholder="请输入验证码" style="flex: 1;" />
                              <el-button
                                  type="success"
                                  plain
                                  :disabled="isCountingDown"
                                  @click="getSmsCode"
                                  style="margin-left: 10px;"
                              >
                                  {{
                                      isCountingDown ? `${countdown}s` : "获 取"
                                  }}
                              </el-button>
                          </el-form-item>
                      </el-form>
                      <div>
                          <el-button type="info" plain size="large" @click="showPassORmobile(1)">修改密码</el-button>
                          <el-button type="info" plain size="large" @click="backUsercenter">返回个人中心</el-button>
                          <el-button type="success" plain size="large" @click="submitmobileForm">确认</el-button>
                      </div>
                  </div>
              </div>
          </div>
          <!-- 行为验证码 -->
          <el-dialog
              v-model="dialogVisible"
              width="31vh"
              class="captchaDialog"
              show-close="false"
          >
              <captcha-slider @close-dialog="finishCheck"></captcha-slider>
          </el-dialog>
    </div>
</template>
  
<script setup>
import { ref,onMounted} from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from "vue-router";
import { getToken, removeToken } from "../../util/auth";
import {
Edit
} from '@element-plus/icons-vue'
import { 
    getUserName,
    putUserpass,
    putUsermobile,
    smsCodeGet
} from '../../api/userinfo';

const router = useRouter();

// 修改手机号密码展示
let showUserPassword = ref(true)
let showUsermobile = ref(false)

function showPassORmobile(num){
    if(num === 1){
        showUserPassword.value = true;
        showUsermobile.value = false;
    }else{
        showUserPassword.value = false;
        showUsermobile.value = true
    }
}
// 行为验证码
const dialogVisible = ref(false)
const isSwitched = ref(true);
function finishCheck() {
    dialogVisible.value = false;
    if(isSwitched.value){
        putUserPassword(UserPass.value)
    }
}

onMounted(()=>{
    getUserValue(); 
})

// 返回个人中心
function backUsercenter(){
    router.push(`/home/userInfo`);
}

// 获取用户信息
const UserNews = ref({})
function getUserValue(){
    getUserName()
    .then(res=>{
        // console.log(res);
        UserNews.value = res.data;
        for (let key in UserNews.value) {
            if (!UserNews.value[key]||UserNews.value[key] === '') {
                UserNews.value[key] = '暂无信息';
            }
        }
    })
    .catch(error =>{
        console.log(error);
    })
}

// 修改用户密码
function putUserPassword(data){
    const dataValue = {
        newPassword1:data.password,
        newPassword2:data.confirmPassword
    }
    putUserpass(dataValue)
    .then(res =>{
        console.log(res)
        ElMessage({
            message:"修改成功,请返回重新登录",
            type:"success"
        })
        removeToken();
        router.push("/login");
    })
    .catch(error =>{
        console.log(error)
    })
}

// 修改用户手机号
function putUsermobileValue(data){
    putUsermobile(data)
    .then(res => {
        console.log(res)
        ElMessage({
            message:"修改成功",
            type:"success"
        })
        getUserValue();
    })
    .catch(error =>{
        console.log(error)
    })
}

const validateConfirmPassword = (rule, value, callback) => {
    if (UserPass.value.confirmPassword === UserPass.value.password) {
        callback();
    } else {
        callback(new Error("两次输入密码不一致"));
    }
};
// 修改密码验证
const UserPassrules = ref({
    smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur" }
    ],
    confirmPassword: [
        { required: true, message: "请确认密码", trigger: "blur" },
        { validator: validateConfirmPassword, trigger: "blur" },
    ],
})

// 提交修改密码表单
const UserPass = ref({
    password:"",
    confirmPassword:"",
})
const UserPassForm = ref()
const submitPassForm = async () => {
    if (!UserPassForm.value){
        return
    } ;
    await UserPassForm.value.validate((valid) => {
        if (valid) {
            dialogVisible.value = true;
            // putUserPassword(UserPass.value)
        } else {
            return false;
        }
    });
};
// 修改手机号
const Usermobilerules = ref({
    mobile: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
        },
    ],
    smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
})

// 获取验证码倒计时
const countdown = ref(60);
const isCountingDown = ref(false);

// 获取手机验证码
function getSmsCode() {
    if(UsermobileValue.value.mobile === ''){
        ElMessage({
            message:"请先填写手机号",
            type:"error"
        })
        return;
    }
    smsCodeGet(UsermobileValue.value.mobile)
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

// 提交修改手机号表单
const UsermobileValue = ref({
    mobile:'',
    smsCode:''
})
const UsermobileForm = ref()
const submitmobileForm = async () => {
    if (!UsermobileForm.value){
        ElMessage({
            message:"请将信息补充完整",
            type:"error"
        })
        return
    } ;
    await UsermobileForm.value.validate((valid) => {
        if (valid) {
            putUsermobileValue(UsermobileValue.value);
        } else {
            return false;
        }
    });
};

</script>

<style lang="less" scoped>
.main{
    display: flex;
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    background-repeat: repeat;
    background-size: cover;
    min-height: 90vh;
    .Banner{
        width: 80%;
        margin-bottom:2vh;
        background-color: #fcf6f3;
        border-radius: 5vh;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: -3px 3px 5px rgba(0, 0, 0, 0.1), 3px 3px 5px rgba(0, 0, 0, 0.1), 0 3px 5px rgba(0, 0, 0, 0.1);
        .userNews{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .margin-top{
                width: 90%;
                border-radius: 3vh;
                background-color: #fff;
                padding: 2%;
                margin-top: 1%;
                margin-bottom: 1%;
                box-sizing: border-box;
            }
        }
    }
    .BannerPass{
        width: 50%;
        margin-bottom:2vh;
        background-color: #fcf6f3;
        border-radius: 5vh;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: -3px 3px 5px rgba(0, 0, 0, 0.1), 3px 3px 5px rgba(0, 0, 0, 0.1), 0 3px 5px rgba(0, 0, 0, 0.1);
        .userNews{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .margin-top{
                width: 90%;
                border-radius: 3vh;
                background-color: #fff;
                padding: 2%;
                margin-top: 1%;
                margin-bottom: 1%;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column; 
                h2{
                    margin-bottom: 5%;
                    margin-top: 1%;
                    // margin: 0%;
                    // padding: 0%;
                }
            }
        }
    }
    :deep(.el-dialog) {
        background: transparent;
        box-shadow: none;
        margin: 25vh auto;
    }
}
</style>

