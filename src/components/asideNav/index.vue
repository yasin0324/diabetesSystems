<template>
    <div class="main">
        <el-menu
            :default-active="defaultPage"
            router
            background-color="transparent"
            active-text-color="#736ffe"
            text-color="#70708c"
            class="el-menu-demo"
        >
            <el-menu-item index="/home/adminHome"
                ><el-icon><HomeFilled /></el-icon>
                <span>主页</span></el-menu-item
            >
            <el-sub-menu index="/home/health">
                <template #title>
                    <el-icon><Histogram /></el-icon>
                    <span>健康数据管理</span>
                </template>
                <el-menu-item index="/home/health/food">
                    <el-icon><Food /></el-icon>
                    <span>食品管理</span>
                </el-menu-item>
                <el-menu-item index="/home/health/articles"
                    ><el-icon><Document /></el-icon
                    ><span>文章管理</span></el-menu-item
                >
                <el-menu-item index="/home/health/sports"
                    ><el-icon><Basketball /></el-icon
                    ><span>运动管理</span></el-menu-item
                >
            </el-sub-menu>
            <el-sub-menu index="/home/data">
                <template #title>
                    <el-icon><TrendCharts /></el-icon>
                    <span>数据分析与报表</span>
                </template>
                <el-menu-item index="/home/data/blood"
                    ><el-icon><Stopwatch /></el-icon
                    ><span>血糖分析</span></el-menu-item
                >
                <el-menu-item index="/home/data/diet"
                    ><el-icon><Food /></el-icon
                    ><span>饮食分析</span></el-menu-item
                >
                <el-menu-item index="/home/data/medicine"
                    ><el-icon><FirstAidKit /></el-icon
                    ><span>用药分析</span></el-menu-item
                >
                <el-menu-item index="/home/data/sportsdata"
                    ><el-icon><Basketball /></el-icon
                    ><span>运动分析</span></el-menu-item
                >
            </el-sub-menu>
            <el-menu-item index="/home/userData"
                ><el-icon><UserFilled /></el-icon
                ><span>用户管理</span></el-menu-item
            >
            <el-menu-item index="/home/notice">
                <el-icon><WarnTriangleFilled /></el-icon><span>公告管理</span>
            </el-menu-item>
            <el-menu-item index="/home/chatWindow"
                ><el-icon><Comment /></el-icon
                ><span>在线客服</span></el-menu-item
            >
        </el-menu>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { computed, ref, onMounted } from "vue";

const router = useRouter();

const defaultPage = computed(() => {
    return router.currentRoute.value.path;
});

onMounted(() => {
    console.log(router.currentRoute.value.path);
});
</script>

<style lang="less" scoped>
.main {
    .el-menu-demo {
        border-right: none;
        .el-sub-menu,
        .el-menu-item {
            span {
                font-size: 2vh;
                font-weight: bold;
            }
            --el-menu-hover-bg-color: transparent;
            span:hover {
                color: #736ffe;
            }
        }
    }
}
</style>
