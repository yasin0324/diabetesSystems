<template>
    <div>
        <div class="button">
            <el-button  type="success" color="#736ffe" round plain @click="dialognotice = true">
                发布公告
            </el-button>
            <el-button
                class="resetSearch"
                icon="Refresh"
                color="#736ffe"
                circle
                plain
                @click="ListnoticeValue"
            ></el-button>
            <span class="addArticles">
                <el-input
                    placeholder="根据公告id搜索"
                    class="searchInput"
                    v-model.number="searchnoticeID"
                ></el-input>
                <el-button  
                color="#736ffe"
                class="searchButton"
                round 
                plain
                @click="searchnotice"
                    >搜索</el-button
                >
            </span>
            
        </div>
        <el-table :data="noticeValue" style="width: 100%" >
            <el-table-column label="发布管理员id" fixed  width="120" prop="adminId"/>
            <el-table-column label="公告id" width="100" prop="id"/>
            <el-table-column label="标题" width="200" prop="title"/>
            <el-table-column label="发布时间" width="200" prop="createTime" />
            <el-table-column :fixed="right" label="操作">
            <template #default="scope">
                <el-button  type="success" color="#736ffe" round plain @click="handleLook(scope.$index, scope.row)">
                    查看详细信息
                </el-button>
                <el-button  type="success" color="#736ffe" round plain @click="handledel(scope.$index, scope.row)">
                    删除公告
                </el-button>
            </template>
            </el-table-column>
        </el-table>
        <!-- 查看详细信息 -->
        <el-dialog v-model="dialogAllFeedValue" width="1000">
            <el-descriptions
                title="详细公告信息"
                :column="4"
                size="large"
                border
            >
                <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                    <el-icon>
                        <user />
                    </el-icon>
                    发布管理员id
                    </div>
                </template>
                {{ dialogData.adminId}}
                </el-descriptions-item>
                <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                    <el-icon >
                        <iphone />
                    </el-icon>
                    公告id
                    </div>
                </template>
                {{ dialogData.id }}
                </el-descriptions-item>
                <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                    <el-icon >
                        <Timer />
                    </el-icon>
                    反馈时间
                    </div>
                </template>
                {{ dialogData.createTime }}
                </el-descriptions-item>
                <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                    <el-icon>
                        <tickets />
                    </el-icon>
                    标题
                    </div>
                </template>
                <el-tag size="small">{{ dialogData.title }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                        <el-icon >
                            <office-building />
                        </el-icon>
                        公告内容
                        </div>
                    </template>
                    {{dialogData.word}}
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>

        <!-- 发布公告 -->
        <el-dialog v-model="dialognotice" title="发布公告" width="700">
            <el-form
                ref="noticeForm"
                style="min-width: 600px"
                :model="SavenoticeWord"
                status-icon
                :rules="noticerules"
                label-width="auto"
                class="demo-ruleForm"
            >
                <el-form-item label="标题" prop="title">
                <el-input v-model="SavenoticeWord.title" autocomplete="off" />
                </el-form-item>
                <el-form-item label="内容" prop="word">
                <el-input
                    v-model="SavenoticeWord.word"
                    autocomplete="off"
                    type="textarea"
                />
                </el-form-item>
            </el-form>
            <div class="dialog-footer" style="margin-left:70%">
                <el-button @click="resetForm()">取消</el-button>
                <el-button type="success" color="#736ffe" plain @click="submitnoticeForm">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { Savenotice,Listnotice,ListnoticeID,delnotice} from "../../api/notice/index"
import { ref,onMounted } from "vue";
import { ElMessage } from 'element-plus'

onMounted(() =>{
    ListnoticeValue()
})

// 查看详细信息
const dialogAllFeedValue = ref(false)
let dialogData = ref('')
function handleLook(index,data){
    dialogAllFeedValue.value = true
    dialogData.value = data;
}
function handledel(index,data){
    delnoticeValue(data.id);
}

// 发布公告
const dialognotice = ref(false)
const resetForm = () => {
    dialognotice.value = false;
}
// 提交公告表单
const noticeForm = ref(null)
const submitnoticeForm = async () => {
    if (!noticeForm.value) return;
    await noticeForm.value.validate((valid) => {
        if (valid) {
            SavenoticeValue(SavenoticeWord.value);
            dialognotice.value = false
        } else {
            return false;
        }
    });
};

// 根据id查询公告
const searchnoticeID = ref('')
function searchnotice(){
    ListnoticeID(searchnoticeID.value)
    .then(res =>{
        noticeValue.value = res.data
    })
    .catch(error =>{
        console.log(error)
    })
}

// 查询公告
const noticeValue = ref([])
function ListnoticeValue(){
    Listnotice()
    .then(res =>{
        // console.log(res)
        noticeValue.value = res.data
    })
    .then(error =>{
        console.log(error)
    })
}

// 发布公告
const SavenoticeWord = ref({
    title:'',
    word:''
})
function SavenoticeValue(data){
    Savenotice(data)
    .then(res =>{
        // console.log(res)
        ElMessage({
            message: '发布成功',
            type: 'success',
        })
        ListnoticeValue();
    })
    .then(error =>{
        console.log(error)
    })
}
// 表单校验规则
const noticerules = ref({
    title: [{ required: true, message: "请输入标题", trigger: "blur" }],
    word: [{ required: true, message: "请输入内容", trigger: "blur" }],
})


// 删除公告
function delnoticeValue(id){
    delnotice(id)
    .then(res =>{
        ElMessage({
            message: '删除成功',
            type: 'success',
        })
        ListnoticeValue();
    })
    .then(error =>{
        console.log(error)
    })
}


</script>

<style lang="less" scoped>
.button{
    width: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    .searchInput {
        width: 20vh;
    }
    .searchButton {
        margin-left: 1vh;
    }
    .addArticles {
        position: absolute;
        right: 3vh;
    }
}
:deep(.el-input) {
    .el-input__wrapper {
        border-radius: 2vh;
    }
}

:deep(.el-dialog){
    border-radius:2vw;
    padding: 2%;
}
</style>
