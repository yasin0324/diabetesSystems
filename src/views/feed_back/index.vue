<template>
    <div class="main">
        <el-table :data="feed_backValue" style="width: 100%">
            <el-table-column label="反馈用户id" width="100" prop="userId"/>
            <el-table-column label="反馈类型" width="200" prop="type"/>
            <el-table-column label="手机号" width="200" prop="mobile"/>
            <el-table-column label="反馈时间" width="200" prop="createTime" />
            <el-table-column fixed="right" label="操作">
            <template #default="scope">
                <el-button  type="success" color="#736ffe" round plain @click="handleLook(scope.$index, scope.row)">
                    查看详细信息
                </el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
        style="margin-top:1.5vh"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        @current-change="handliesearchPage"/>

         <!-- 查看详细信息 -->
         <el-dialog v-model="dialogAllFeedValue" width="1000">
            <el-descriptions
                title="详细反馈信息"
                :column="1"
                size="large"
                border
            >
                <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                    <el-icon>
                        <user />
                    </el-icon>
                    id
                    </div>
                </template>
                {{ dialogData.id }}
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
                {{ dialogData.mobile }}
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
                    类型
                    </div>
                </template>
                <el-tag size="small">{{ dialogData.type }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                        <el-icon >
                            <office-building />
                        </el-icon>
                        反馈内容
                        </div>
                    </template>
                    {{dialogData.word}}
                </el-descriptions-item>
                <el-descriptions-item >
                    <template #label>
                        <div class="cell-item">
                        反馈图片
                        </div>
                    </template>
                    <div >
                        <img v-for="(item,index) in dialogData.feedBackPictures" :key="index" :src="item.picture" alt="" class="dialog-img">
                    </div>
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script setup>
import { SaveFeed_back } from '../../api/feed_back';
import { ref,onMounted } from 'vue';


onMounted(() =>{
    SaveFeed_backValue();
})

// 查询反馈信息
const feed_backValue = ref([])
let page = ref(1)
let pageSize = ref(10)
let total = ref(10)
// 分页查询
const handliesearchPage = (newPage)=>{
    page.value = newPage
    const data = {
        page: page.value,
        pageSize:pageSize.value
    }
    SaveFeed_backValue(data)
}
function SaveFeed_backValue(){
    const data = {
        page: page.value,
        pageSize:pageSize.value
    }
    SaveFeed_back(data)
    .then(res =>{
        console.log(res)
        feed_backValue.value = res.data.feedBackVOList;
        total.value = res.data.total;
    })
    .catch(error =>{
        console.log(error)
    })
}
const dialogAllFeedValue = ref(false)
let dialogData = ref('')
function handleLook(index,data){
    dialogAllFeedValue.value = true
    dialogData.value = data;
}



</script>

<style lang="less" scoped>
.main{
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    :deep(.el-pagination){
        li.is-active {
            background-color: #736ffe;
            // background-color: #84d21e;
            color: var(--el-color-white);
        }
        li:hover{
            background-color: #736ffe;
            color: var(--el-color-white);
        }
    }
    :deep(.el-dialog){
        border-radius:2vw;
        padding: 2%;
    }
    .dialog-img{
        width: 20vw;
        margin-left: 2vw;
        object-fit: cover;
    }
}
</style>