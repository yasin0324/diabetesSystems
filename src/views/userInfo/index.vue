<template>
    <div class="main">
        <div class="head">
            <el-row>
                <el-col :span="4">
                    <div class="header" >
                        <el-avatar
                            :src="UserNewsValue.avatar"
                            :size="120"
                        />
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="userNews" >
                        <el-row>
                            <el-col :span="20">
                                <h3>
                                    昵称：{{ UserNewsValue.nickName }}
                                </h3>
                                <p>
                                    个人简介：{{ UserNewsValue.introduction }}
                                </p>
                                <p>
                                    账号创建时间：{{ UserNewsValue.createTime }}
                                </p>
                                <p style="margin-bottom:0.5%">
                                    上次信息修改时间：{{ UserNewsValue.updateTime }}
                                </p>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="success" plain :icon="Edit" circle style="margin-left: 10%;" @click="dialogUserIntro = true"/>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="userNews"> 
                        <div style="height:100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;">
                            <div>
                                <p  style="font-size:1.2vw">
                                    账号：{{ UserNewsValue.userName }}
                                </p>
                                <p  style="font-size:1.2vw">
                                    绑定手机号：{{ UserNewsValue.mobile }}
                                </p>
                            </div>
                            <el-button type="success" style="width: 80%;" plain size="small" @click="toeditpassMobile">修改</el-button>
                        </div>   
                    </div>
                </el-col>
            </el-row>
        </div>
        
        <div class="Banner" >
            <div class="userNews">
                <el-descriptions
                    class="margin-top"
                    title="个人基本信息"
                    size="large"
                    :column="3"
                    border
                >
                    <template #extra>
                        <el-button type="success" plain :icon="Edit" circle @click="dialogUserValue = true"/>
                    </template>
                    <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                        <el-icon>
                            <user />
                        </el-icon>
                        姓名
                        </div>
                    </template>
                    {{ UserNewsValue.name }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                        <el-icon >
                            <iphone />
                        </el-icon>
                        手机号
                        </div>
                    </template>
                    {{ UserNewsValue.mobile }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <Female />
                                </el-icon>
                                性别
                            </div>
                        </template>
                        {{ UserNewsValue.gender }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </div>
        <!-- 关联账户信息 -->
        <div class="BannerAllUser" >
            <div class="userNews">
                <h1>已关联账号<el-icon><CopyDocument /></el-icon></h1>
                <div class="margin-top" >
                    <el-button type="success" plain style="float:right" @click="Addassociated(1)">新增关联账号</el-button>
                    <el-row>
                        <el-col :span="6" v-for="(item,index) in AllUserValue" :key="index">
                            <div class="User">
                                <div class="avatar">
                                    <el-avatar :src="item.avatar" />
                                </div>
                                <span>昵称：{{item.nickName}}</span>
                                <el-button type="success" size="small" color="#f89867" round style="width:100%; margin-top:1vh" plain @click="LookassociatedUser(item)">查看详细信息</el-button>
                                <el-button type="success" size="small" color="#f89867" round style="width:100%; margin-top:1vh; margin-left:0%" plain @click="Cancelassociated(item)">取消关联</el-button>
                                <el-button type="success" size="small" color="#f89867" round style="width:100%; margin-top:1vh; margin-left:0%" plain @click="ToggleLogin(item)">切换登录</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <!-- 个人简介修改 -->
        <el-dialog v-model="dialogUserIntro" title="修改个人信息" width="600" draggable>
            <div class="Userhead">
                <el-text class="mx-1" size="large">请选择头像上传</el-text>
                <el-upload
                    class="avatar-uploader"
                    action="/api/common/upload"
                    :headers="token"
                    :show-file-list="false"
                    :on-success="avatarUploadProps.onSuccess"
                    :before-upload="avatarUploadProps.beforeUpload"
                >
                    <img v-if="UserNews.avatar" :src="UserNews.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </div>
            <el-form
                ref="UserIntroForm"
                style="max-width: 600px"
                :model="UserNews"
                status-icon
                :rules="UserIntrorules"
                label-width="auto"
                class="demo-ruleForm"
            >
                <el-form-item label="昵称" prop="nickName">
                <el-input v-model="UserNews.nickName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="个人简介" prop="introduction">
                <el-input
                    v-model="UserNews.introduction"
                    autocomplete="off"
                    type="textarea"
                />
                </el-form-item>
            </el-form>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="resetForm()">取消</el-button>
                <el-button type="success" @click="submitIntroForm">
                    确定
                </el-button>
            </div>
            </template>
        </el-dialog>

        <!-- 修改个人基本信息 -->
        <el-dialog v-model="dialogUserValue" title="修改身体基本信息" width="600" draggable>
            <el-form
            ref="UserValueForm"
            style="max-width: 600px"
            :model="UserNews"
            status-icon
            :rules="UserIntrorules"
            label-width="auto"
            class="demo-ruleForm"
        >
            <el-form-item label="姓名" prop="name">
            <el-input v-model="UserNews.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="UserNews.gender" class="ml-4">
                    <el-radio value="男" >男</el-radio>
                    <el-radio value="女" >女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="生日" prop="name">
                <div class="block">
                    <el-date-picker
                        v-model="UserNews.birthday"
                        type="date"
                        placeholder="请选择日期"
                        size="default"
                        @change="handlePanelChange"
                    />
                </div>
            </el-form-item>
        </el-form>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="resetForm()">取消</el-button>
                <el-button type="success" @click="submitUserForm">
                    确定
                </el-button>
            </div>
            </template>
        </el-dialog>

        <!-- 展示关联用户详细信息 -->
        <el-dialog v-model="dialogassociatedUser" width="600">
            <div class="AssociatedUser">
                <el-descriptions
                    title="关联用户详细信息"
                    :column="3"
                    size="large"
                    border
                >
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                            <el-icon>
                                <user />
                            </el-icon>
                            账号：
                            </div>
                        </template>
                    {{ AssociatedUserValue.userName }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                        <el-icon>
                            <user />
                        </el-icon>
                        昵称：
                        </div>
                    </template>
                    {{ AssociatedUserValue.nickName }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                        <el-icon>
                            <user />
                        </el-icon>
                        姓名
                        </div>
                    </template>
                    {{ AssociatedUserValue.name }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                        <el-icon >
                            <iphone />
                        </el-icon>
                        手机号
                        </div>
                    </template>
                    {{ AssociatedUserValue.mobile }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <Female />
                                </el-icon>
                                性别
                            </div>
                        </template>
                        {{ AssociatedUserValue.gender }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon><Avatar /></el-icon>
                                年龄
                            </div>
                        </template>
                        {{ AssociatedUserValue.age }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                        <el-icon >
                            <tickets />
                        </el-icon>
                        生日
                        </div>
                    </template>
                    {{ AssociatedUserValue.birthday }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                        <el-icon >
                            <office-building />
                        </el-icon>
                        地址
                        </div>
                    </template>
                    {{ AssociatedUserValue.address }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            
        </el-dialog>

        <!-- 关联账号 -->
        <el-dialog v-model="dialogAddassociated" width="600">
            <!-- 账户登录 -->
            <div v-show="showuserNameLogin" class="center">
                <h2>账号密码登录</h2>
                    <el-form
                        ref="UserNameFrom"
                        style="min-width: 300px"
                        :model="UserNamePassLogin"
                        status-icon
                        :rules="UserNamerules"
                        label-width="auto"
                    >
                        <el-form-item label="账号:" prop="userName" >
                            <el-input v-model="UserNamePassLogin.userName" placeholder="请输入账号" style="flex: 1;" />
                        </el-form-item>
                        <el-form-item label="密码:" prop="password" >
                            <el-input v-model="UserNamePassLogin.password" placeholder="请输入密码" style="flex: 1;" show-password/>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-button type="info" plain size="large" @click="Addassociated(2)">使用手机号登录</el-button>
                        <el-button type="success" plain size="large" @click="submitUserPassLoginForm">确认</el-button>
                    </div>
            </div>
            <!-- 手机号登录 -->
            <div v-show="showmobileLogin" class="center">
                <h2>手机号登录</h2>
                    <el-form
                        ref="UsermobileForm"
                        style="min-width: 300px"
                        :model="UsermobileValue"
                        status-icon
                        :rules="Usermobilerules"
                        label-width="auto"
                        class="fromPass"
                    >
                        <el-form-item label="手机号:" prop="mobile" >
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
                        <el-button type="info" plain size="large" @click="Addassociated(1)">使用账号密码登录</el-button>
                        <el-button type="success" plain size="large" @click="submitmobileForm">确认</el-button>
                    </div>
            </div>
        </el-dialog>
        <!-- 行为验证码 -->
        <el-dialog
            v-model="dialogVisible"
            width="31vh"
            class="captchaDialog"
            show-close="false"
            style="background: transparent;
                    box-shadow: none;
                    margin: 25vh auto;"
        >
            <captcha-slider @close-dialog="finishCheck"></captcha-slider>
        </el-dialog>
    </div>
</template>
<script setup>
import {
    getUserName,
    putUserName,
    getOneUser,
    smsCodeGet,
    putAddUserConnection,
    putDelUserConnection,
    postUserConnection,
    putAddMobileConnection
} from '../../api/userinfo/index'
import { ref,onMounted,onBeforeUnmount} from 'vue'
import { setToken,removeToken } from "../../util/auth";
import { getToken } from '../../util/auth';
import { ElMessage } from 'element-plus'
import { useRouter } from "vue-router";
import {
  Edit
} from '@element-plus/icons-vue'

const router = useRouter();

const token = {token:getToken()}



// el-dialog展示
let dialogUserIntro = ref(false)
let dialogUserValue = ref(false)
let dialogUserBody = ref(false)
let dialogassociatedUser = ref(false)

// 查看关联用户详细信息
const AssociatedUserValue = ref()
function LookassociatedUser(item){
    dialogassociatedUser.value = true;
    AssociatedUserValue.value = item;
}


// 切换登录
const toggleLoginID = ref('');
function ToggleLogin(item){
    isSwitched.value = 4;
    dialogVisible.value = true;
    toggleLoginID.value = item.userId;
}

// 头像上传成功处理函数
const handleAvatarSuccess = (response, uploadFile) => {
    UserNews.value.avatar = response.data;
};

// 头像上传前的校验函数
const beforeAvatarUpload = (file) => {
    // console.log(file)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // 允许的图片格式
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    // 检查图片格式是否合法
    if (!allowedTypes.includes(file.type)) {
        ElMessage.error('照片只能是  JPEG, PNG, GIF 格式!');
        return false;
    }

    // 检查图片大小是否超出限制
    if (file.size > maxFileSize) {
        ElMessage.error('照片大小不能超过 5MB!');
        return false;
    }

    return true;
};

// 调用头像上传钩子函数
const avatarUploadProps = {
  onSuccess: handleAvatarSuccess,
  beforeUpload: beforeAvatarUpload
};

// 调整头像大小
const avatarSize = ref('large');
const calculateAvatarSize = () => {
    // 计算当前视窗宽度的10%
    const windowWidth10Percent = window.innerWidth * 0.1;
    avatarSize.value = windowWidth10Percent > 120 ? 'large' : 'medium';
    // console.log(avatarSize.value)
};


function handlePanelChange(dateString) {
    const selectedDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    UserNews.value.age = age;
}

// 表单校验规则
const UserIntrorules = ref({
    nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
    introduction: [{ required: true, message: "请输入个人简介", trigger: "blur" }],
    gender: [{ type: 'enum', enum: ['男', '女'], message: "请选择性别", trigger: "change" }],
    birthday: [
        { required: true, message: "请选择生日", trigger: "blur" },
        { type: 'date', message: "请选择合法生日", trigger: "change" }
    ],
    occupation: [{ required: true, message: "请输入职业", trigger: "blur" }],
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
})


const resetForm = () => {
  dialogUserIntro.value = false;
  dialogUserValue.value = false;
  dialogUserBody.value = false;
  getUserValue();
}

// 去修改密码
const toeditpassMobile = () =>{
    router.push(`/home/editpassMobile`)
}
// 手机号表单验证
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
const UserNamerules = ref({
    userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur" }
    ],
})

const dialogAddassociated  = ref(false)
const showuserNameLogin = ref(false)
const showmobileLogin = ref(false)
const Addassociated = (flag) =>{
    dialogAddassociated.value = true;
    if(flag === 1){
        showuserNameLogin.value = true;
        showmobileLogin.value = false;
    }else if(flag === 2){
        showuserNameLogin.value = false;
        showmobileLogin.value = true
    }
}

// 取消关联账号
const CancelassociatedUserID = ref('')
function Cancelassociated(item){
    dialogVisible.value = true;
    isSwitched.value = 3;
    CancelassociatedUserID.value = item.userId;
}


onMounted(()=>{
    getUserValue();
    calculateAvatarSize();
    // 监听窗口大小变化
    window.addEventListener('resize', calculateAvatarSize);
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', calculateAvatarSize);
});

// 行为验证码
const dialogVisible = ref(false)
const isSwitched = ref(null)
function finishCheck() {
    dialogVisible.value = false;
    if(isSwitched.value === 1){
        postAddUser();
    }else if(isSwitched.value === 2){
        postAddmobile();
    }else if(isSwitched.value === 3){
        let data = CancelassociatedUserID.value
        putDelUserConnection(data)
        .then(res =>{
            console.log(res.data)
            ElMessage({
                message: '取消关联成功',
                type: 'success',
            })
            getUserValue();
        })
        .catch(error =>{
            console.log(error)
        })
    }else if(isSwitched.value === 4){
        postUserConnection(toggleLoginID.value)
        .then(res =>{
            // console.log(res)
            removeToken();
            setToken(res.data.token)
            ElMessage({
                message:"切换账号登录成功",
                type:"success"
            })
            toggleLoginID.value = '';
            getUserValue();
        })
        .catch(error =>{
            console.log(error)
        })
    }
}

// 获取用户信息
const UserNews = ref({})
const UserNewsValue = ref({})
function getUserValue(){
    getUserName()
    .then(res=>{
        UserNews.value = res.data;
        UserNewsValue.value = UserNews.value;
        AllUserValue.value = [];
        getAllUserValue();
    })
    .catch(error =>{
        console.log(error);
    })
}

// 获取所有用户信息
const AllUserValue = ref([])
function getAllUserValue(){
    if(UserNews.value.associatedIds === null){
        return;
    }
    UserNews.value.associatedIds.forEach((userId,index) =>{
        getOneUser(userId)
        .then(res=>{
            AllUserValue.value.push(res.data)
        })
        .catch(error =>{
            console.log(error);
        })
    })
}

// 提交修改的用户信息
function putUserValue(data){
    putUserName(data)
    .then(res=>{
        // console.log(res);
        ElMessage({
            message: '修改成功',
            type: 'success',
        })
        UserNewsValue.value = UserNews.value;
    })
    .catch(error =>{
        console.log(error);
    })
}

// 上传的表单数据
const UserFormValue = ref({})

// 提交昵称基本信息表单
const UserIntroForm = ref(null)
const submitIntroForm = async () => {
    if (!UserIntroForm.value) return;
    await UserIntroForm.value.validate((valid) => {
        if (valid) {
            UserFormValue.value.userId = UserNews.value.userId;
            UserFormValue.value.nickName = UserNews.value.nickName;
            UserFormValue.value.introduction = UserNews.value.introduction;
            UserFormValue.value.avatar = UserNews.value.avatar
            // console.log(UserFormValue.value)
            dialogUserIntro.value = false;
            putUserValue(UserFormValue.value)
            getUserValue();
        } else {
            return false;
        }
    });
};

// 提交基本信息表单
const UserValueForm = ref(null);
const submitUserForm = async () => {
    if (!UserValueForm.value) return;
    await UserValueForm.value.validate((valid) => {
        if (valid) {
            UserFormValue.value.userId = UserNews.value.userId;
            UserFormValue.value.name = UserNews.value.name;
            UserFormValue.value.gender = UserNews.value.gender;
            const birthday = new Date(UserNews.value.birthday);
            const formattedBirthday = birthday.toISOString().split('T')[0];
            UserFormValue.value.birthday = formattedBirthday;
            UserNews.value.birthday = UserFormValue.value.birthday;
            // console.log(UserFormValue.value)
            dialogUserValue.value = false;
            putUserValue(UserFormValue.value)
            getUserValue();
        } else {
            return false;
        }
    });
};

// 提交关联账户密码账号
// 关联账号
function putAddassociatedUser(data){
    putAddUserConnection(data)
    .then(res =>{
        // console.log(res.data)
        ElMessage({
            message: '添加关联成功',
            type: 'success',
        })
        getUserValue();
    })
    .catch(error =>{
        console.log(error)
    })
}
const UserNameFrom = ref(null)
const UserNamePassLogin = ref({
    userName:'',
    password:'',
})
const submitUserPassLoginForm = async () => {
    if (!UserNameFrom.value) return;
    await UserNameFrom.value.validate((valid) => {
        if (valid) {
            isSwitched.value = 1;
            dialogVisible.value = true;
        } else {
            return false;
        }
    });
};
const postAddUser = () =>{
    dialogAddassociated.value = false;
    putAddassociatedUser(UserNamePassLogin.value);
    UserNamePassLogin.value = {
        userName:'',
        password:'',
    }
    isSwitched.value = null
}

// 提交手机号关联
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
            isSwitched.value = 2;
            dialogVisible.value = true;
        } else {
            return false;
        }
    });
};
const postAddmobile = () =>{
    dialogAddassociated.value = false;
    putAddMobileConnection(UsermobileValue.value)
    .then(res =>{
        ElMessage({
            message: '添加关联成功',
            type: 'success',
        })
        getUserValue();
    })
    UserNamePassLogin.value = {
        userName:'',
        password:'',
    }
    isSwitched.value = null
}

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

</script>
<style lang="less" scoped>
.main{
    display: flex;
    flex-direction: column; /* 垂直排列 */
    justify-content: center; 
    align-items: center; 
    background-repeat: repeat;
    background-size: cover;
    min-height: 90vh;
    .head{
        width: 100%;
        margin-bottom:2vh;
        background-color: #fcf6f3;
        border-radius: 5vh;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: -3px 3px 5px rgba(0, 0, 0, 0.1), 3px 3px 5px rgba(0, 0, 0, 0.1), 0 3px 5px rgba(0, 0, 0, 0.1);
        .el-row{
            padding: 1%;
            width: 100%;
            height: 100%;
            .el-col{
                .header{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                        width: 100%;
                        max-width: 120px;
                        display: block;
                        border-radius: 50%;
                        border: 1px dashed #d9d9d9;
                    }
                }
                .userNews{
                    width: 95%;
                    height: 100%;
                    border-radius: 3vh;
                    background-color: #fff;
                    padding: 2%;
                    box-sizing: border-box;
                    h3{
                        font-size: 2vw;
                        margin-top: 1.5%;
                        margin-bottom: 1.5%;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    p{
                        margin-top: 1%;
                        margin-bottom: 1%;
                        font-size: 1vw;
                    }
                }
            }
            
        }
    }
    .Banner{
        width: 100%;
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
                .el-col{
                    margin: 1vw;
                    font-size: 1.2vw;
                    text-align: center;
                    .avatar{
                        width: 100%;
                        .el-avatar{
                            width:10vw;
                            height:10vw;
                        }
                    }
                    
                }
            }
        }
    }
    .BannerAllUser{
        width: 100%;
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
            flex-direction: column;
            h1{
                font-size: 2.5vw;
                margin-top: 1vh;
                margin-bottom: 1vh;
                color: #b79f74;
                .el-icon{
                    line-height:100%;
                    font-size: 2vw;
                    margin-left: 0.5vw;
                }
            }
            .margin-top{
                width: 90%;
                border-radius: 3vh;
                background-color: #fff;
                padding: 2%;
                margin-top: 1%;
                margin-bottom: 1%;
                box-sizing: border-box;
                .el-col{
                    margin: 1vw;
                    font-size: 1.2vw;
                    text-align: center;
                    .User{
                        background-color: #f7e5dc;
                        padding: 1vw;
                        border-radius: 3vh;
                        .avatar{
                            width: 100%;
                            .el-avatar{
                                width:8vw;
                                height:8vw;
                            }
                        }
                    }
                    
                    
                }
            }
        }
    }
    :deep(.el-dialog){
        border-radius:2vw;
        padding: 2%;
        .Userhead{
            display: flex;
            flex-direction: column; /* 垂直排列 */
            justify-content: center; 
            align-items: center;
            padding-bottom: 5%;
        }
        .avatar-uploader .avatar {
            width:  12vw;
            height: 12vw;
            display: block;
        }
        .avatar-uploader .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 50%;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .avatar-uploader .el-upload:hover {
            border-color: #a3c576;
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width:  12vw;
            height: 12vw;
            text-align: center;
        }

        .center{
            display: flex;
            flex-direction: column; /* 垂直排列 */
            justify-content: center; 
            align-items: center;
        }
    }
}
</style>
